require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// Import routes
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const shippingAddressRoute = require("./routes/shippingAddressRoute");
const paymentMethodRoute = require("./routes/paymentMethodRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const userRewardRoute = require("./routes/userRewardRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const messageRoute = require("./routes/messageRoute");
const supportRequestRoutes = require("./routes/supportRequestRoutes");

// Khởi tạo ứng dụng express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Định nghĩa routes
app.use("/api/auth/", authRoute);
app.use("/api/products/", productRoute);
app.use("/api/shipping-addresses", shippingAddressRoute);
app.use("/api/payment-methods", paymentMethodRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/user-rewards", userRewardRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api", messageRoute);
app.use("/api/support-requests", supportRequestRoutes);

// Cấu hình MongoDB
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB`);

    // Tạo HTTP server để dùng chung với express và socket.io
    const server = http.createServer(app);

    // Khởi tạo Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "*", // Cấu hình CORS nếu cần
      },
    });

    // Lắng nghe sự kiện từ client
    io.on("connection", (socket) => {
      // console.log("A user connected:", socket.id);

      socket.on("disconnect", () => {
        // console.log("A user disconnected:", socket.id);
      });

      socket.on("chat message", (data) => {
        const { msg, imageUri } = data;

        // Kiểm tra nếu cả msg và imageUri đều null thì không phát
        if (!msg && !imageUri) {
          // console.log("Received empty message. Ignoring...");
          return;
        }

        // console.log(`Message from ${socket.id}:`, { msg, imageUri });

        // Phát lại tin nhắn cho tất cả client
        io.emit("chat message", {
          msg: msg || null,
          imageUri: imageUri || null,
          sender: socket.id,
        });
      });
    });



    // Khởi chạy server
    server.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}/`)
    );
  })
  .catch((error) => console.log(`Error connecting to DB:`, error.message));
