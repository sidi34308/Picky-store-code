const Order = require("../../models/Order");
const Product = require("../../models/Product");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateProductQuantities = async (req, res) => {
  const { cartItems } = req.body;

  try {
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        console.log(
          `Updating product ${product._id}: current quantity ${product.totalStock}, reducing by ${item.quantity}`
        );
        product.totalStock -= item.quantity;
        const savedProduct = await product.save();
        console.log(
          `Product ${savedProduct._id} updated: new quantity ${savedProduct.quantity}`
        );
      } else {
        console.log(`Product with ID ${item.productId} not found`);
      }
    }
    res.status(200).json({
      success: true,
      message: "Product quantities updated successfully",
    });
  } catch (error) {
    console.error("Error updating product quantities:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product quantities",
      error,
    });
  }
};
module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  updateProductQuantities,
};
