require('dotenv').config()


const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute'); 
const shippingAddressRoute = require('./routes/shippingAddressRoute');
const paymentMethodRoute = require('./routes/paymentMethodRoute');
const wishlistRoute = require('./routes/wishlistRoute');
const userRewardRoute = require('./routes/userRewardRoute'); 
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
// const { updateUserRoles } = require('./controllers/authController');
// initialize a new express application instance
const app = express();

// middlewares
app.use(express.json())
app.use(cors())


// routes
app.use("/api/auth/", authRoute);
app.use('/api/products/', productRoute);
app.use('/api/shipping-addresses', shippingAddressRoute);
app.use('/api/payment-methods', paymentMethodRoute);
app.use('/api/wishlist', wishlistRoute);
app.use('/api/user-rewards', userRewardRoute); 
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);

// connect to DataBase (MONGODB)
const PORT = process.env.PORT // http://localhost:4000/api/auth/  -> POST
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    app.listen(PORT, () => console.log(`Connected to DB, and running on http://localhost:${PORT}/`));
    // await updateUserRoles(); // Chạy hàm cập nhật sau khi kết nối DB thành công
  })
  .catch((error) => console.log(`Error:`, error.message));
