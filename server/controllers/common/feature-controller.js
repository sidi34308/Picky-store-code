const Feature = require("../../models/Feature");
const Order = require("../../models/Order");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    console.log(image, "image");

    const featureImages = new Feature({
      image,
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

async function sendOrderEmail(req, res) {
  const { to, subject, orderDetails } = req.body;

  // Generate a unique order ID
  const orderId = `ORD-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  // Create the HTML table for the order details
  const orderTableRows = orderDetails.cartItems
    .map(
      (item) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.title}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.price} ريال</td>
        </tr>
      `
    )
    .join("");

  const orderTableHTML = `
    <table style="border-collapse: collapse; width: 100%;" style="direction: rtl;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">اسم المنتج</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">الكمية</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">السعر</th>
        </tr>
      </thead>
      <tbody>
        ${orderTableRows}
      </tbody>
    </table>
    <p><strong>إجمالي السعر:</strong> ${orderDetails.totalAmount} ريال</p>
    <p><strong>تاريخ الطلب:</strong> ${new Date(
      orderDetails.orderDate
    ).toLocaleString()}</p>
  `;

  const adminEmailHTML = `
    <h3>تفاصيل الطلب الجديد</h3>
    <p><strong>رقم الطلب:</strong> ${orderId}</p>
    <p><strong>اسم العميل:</strong> ${orderDetails.fullName}</p>
    <p><strong>تاريخ الميلاد:</strong> ${new Date(
      orderDetails.birthDate
    ).toLocaleDateString()}</p>
    <p><strong>رقم الهاتف:</strong> ${orderDetails.phone}</p>
    <p><strong>العنوان:</strong> ${orderDetails.address}, ${
    orderDetails.region
  }</p>
    <p><strong>ملاحظات:</strong> ${orderDetails.notes || "لا توجد ملاحظات"}</p>
    ${orderTableHTML}
  `;

  const userEmailHTML = `
    <h3>شكراً لطلبك من متجرنا</h3>
    <p>عزيزي ${orderDetails.fullName},</p>
    <p>نشكرك على طلبك. فيما يلي تفاصيل طلبك:</p>
    <p><strong>رقم الطلب:</strong> ${orderId}</p>
    ${orderTableHTML}
    <p>سنتواصل معك قريباً لتأكيد الطلب وتوصيله إلى بابك.</p>
    <p>شكراً لتسوقك معنا!</p>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail", // Using Gmail as the mail service
    secure: true, // true for 465, false for other ports
    auth: {
      user: "pickystoremail@gmail.com",
      pass: "gnqy qnhn fnad usvc", // Use environment variables for sensitive info
    },
  });

  const adminMailOptions = {
    from: "pickystoremail@gmail.com", // This must match the authenticated user
    to: "Rustom3@hotmail.com",
    // to: "sidi34308s@gmail.com",
    subject: "New Order Received",
    html: adminEmailHTML,
  };

  const userMailOptions = {
    from: "pickystoremail@gmail.com",
    to: orderDetails.email,
    subject: "تفاصيل طلبك من متجرنا",
    html: userEmailHTML,
  };

  try {
    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log("Admin email sent successfully:", adminInfo.response);

    const userInfo = await transporter.sendMail(userMailOptions);
    console.log("User email sent successfully:", userInfo.response);

    // Save the order with the generated order ID
    const newOrder = new Order({
      orderId,
      ...orderDetails,
      orderDate: new Date(),
    });
    await newOrder.save();

    console.log("new order", newOrder);
    res.status(200).json({
      success: true,
      message: "Emails sent and order created successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Emails not sent" });
  }
}

module.exports = { addFeatureImage, getFeatureImages, sendOrderEmail };
