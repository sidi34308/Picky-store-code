const Feature = require("../../models/Feature");
const nodemailer = require("nodemailer");

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

  const emailHTML = `
    <h3>تفاصيل الطلب الجديد</h3>
    <p><strong>اسم العميل:</strong> ${orderDetails.fullName}</p>
    <p><strong>رقم الهاتف:</strong> ${orderDetails.phone}</p>
    <p><strong>العنوان:</strong> ${orderDetails.address}, ${
    orderDetails.region
  }</p>
    <p><strong>ملاحظات:</strong> ${orderDetails.notes || "لا توجد ملاحظات"}</p>
    ${orderTableHTML}
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail", // Using Gmail as the mail service
    secure: true, // true for 465, false for other ports
    auth: {
      user: "pickystoremail@gmail.com",
      pass: "gnqy qnhn fnad usvc", // Use environment variables for sensitive info
    },
  });

  const mailOptions = {
    from: "pickystoremail@gmail.com", // This must match the authenticated user
    to: "sidi34308s@gmail.com", // Default email if no recipient is specified
    subject: "New Order Received",
    html: emailHTML,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Email not sent" });
  }
}

module.exports = { addFeatureImage, getFeatureImages, sendOrderEmail };
