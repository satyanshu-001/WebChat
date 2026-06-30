import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js"
import User from "../models/User.js"
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne:loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllContacs:", error);
        res.status(500).json({message: "Server error"});
    }
};

export const getMessagesByUserId = async (req, res) =>{
    try {
        const myId = req.user._id;
        const {id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId} = req.params;
        const senderId = req.user._id;

        if(!text && !image){
            return res.status(400).json({error: "Text or image is required"});
        }
        if(senderId.equals(receiverId)){
            return res.status(400).json({error: "cannot send message to yourself"});
        }
        const recevierExists = await User.findById({_id: receiverId});
        if(!recevierExists){
            return res.status(404).json({error: "Receiver not found"});
        }

        let imageUrl;

        if(image){
            //upload base64 image to clodinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

         const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            }

        

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ",error.message);
        res.status(500).json({error:"Internal server error"});
    }
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        //find all the message where logged in user is either sender or recevier
        const messages = await Message.find({
            $or: [{senderId: loggedInUserId}, {receiverId: loggedInUserId}],
        });

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) => 
                    msg.senderId.toString() === loggedInUserId.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString()
                )
            ),
        ];

        const chatPartners = await User.find({_id: {$in:chatPartnerIds}}).select("-password");
        
        res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error in getChatPartners: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};
