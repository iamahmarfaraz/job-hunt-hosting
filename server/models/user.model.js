import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,  
    unique : true ,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  phoneNumber : {
    type:Number ,
    required : true,
  },
  password : {
    type : String,
    required : true,
  },
  role:{
    type : String,
    enum : ['student','recruiter'],
    required : true,
  },
  profile : {
    bio : {type : String},
    skills : [{type:String }],
    resume : {type:String},  //URL of cloudinary(resume file)
    resumeOriginalName : {type : String},
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Company",
    },
    profilePhoto : {
        type : String,
        default : ""
    }
  }
},{timestamps : true})

export const User = mongoose.model('User', userSchema);