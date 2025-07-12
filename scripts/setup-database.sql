-- MongoDB setup is handled automatically by Mongoose
-- This file is for reference only

-- Photo Collection Structure:
-- {
--   _id: ObjectId,
--   title: String,
--   description: String,
--   imageUrl: String,
--   likes: Number (default: 0),
--   comments: [
--     {
--       _id: ObjectId,
--       text: String,
--       createdAt: Date
--     }
--   ],
--   createdAt: Date
-- }

-- Environment Variables Configuration:
-- Copy these to your .env.local file or set them in your deployment environment

-- === 🔗 MongoDB Connection ===
-- MONGODB_URI=mongodb+srv://indianlancer1802:JXMEDBM0jrlzzIDW@my-portfolio.ccbrgqy.mongodb.net/portfolio?retryWrites=true&w=majority&appName=my-portfolio

-- === 🔐 Admin Login Credentials ===
-- ADMIN_USERNAME=Adhrit
-- ADMIN_PASSWORD=SHRIgeeta@01

-- === 🔑 JWT Secret for Auth Tokens ===
-- JWT_SECRET=0n74qzl7nwys8ys528rnl6l1eume1yu2

-- === 🖼️ Vercel Blob Token for File Uploads ===
-- BLOB_READ_WRITE_TOKEN=vercel_blob_rw_ewZGAPrMItI31iBJ_8D0xSc8lzWt4GMApazbPxUVLJsBEnL

-- Admin Login Instructions:
-- 1. Navigate to /admin
-- 2. Username: Adhrit
-- 3. Password: SHRIgeeta@01
