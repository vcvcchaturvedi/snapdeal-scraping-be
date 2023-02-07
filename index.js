const express = require("express");
const cron = require("node-cron");
const axios = require("axios");
const otp = require("./routes/otp.js");
const otpRouter = otp.router;
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

let snapdealProducts = [];
const fetchProduct = async (url) => {
  const resp = await axios.get(url);
  const htmlData = resp.data;
  const reviewRegex = /<div class="filled-stars" style="width:(.*?)"/;
  const reviewPercentTest = htmlData.match(reviewRegex);
  let reviewPercent = "";
  if (reviewPercentTest) reviewPercent = reviewPercentTest[1];
  const nameRegex = /<h1 itemprop="name" title=".*">[\r\n] (.*)<\/h1>/;
  const nameTest = htmlData.match(nameRegex);
  let name = "";
  if (nameTest) name = nameTest[1].trim();
  let discountedPrice = "";
  const discountedPriceRegex = /itemprop="price">(.*?)<\/span>/;
  const discountedPriceTest = htmlData.match(discountedPriceRegex);
  if (discountedPriceTest) discountedPrice = discountedPriceTest[1];
  let price = "";
  const priceRegex = /class="pdpCutPrice ">.*[\r\n].*Rs.&nbsp;(.*?)</;
  const priceTest = htmlData.match(priceRegex);
  if (priceTest) price = priceTest[1];
  let imageURL = "";
  const imageRegex =
    /slideNum="0" [\n][ ]*class="cloudzoom" [\n][ ]*bigsrc=(.*)/;
  const imageTest = htmlData.match(imageRegex);
  if (imageTest) imageURL = imageTest[1].trim();
  console.log("NAME=" + name);
  console.log("Review percentage:" + reviewPercent);
  console.log("Price = " + price);
  console.log("Discounted price=" + discountedPrice);
  console.log("Image URL: " + imageURL);
  const snapdealProduct = {
    name,
    reviewPercent,
    discountedPrice,
    price,
    imageURL,
  };
};
const fetchDetails = async () => {
  try {
    const resp = await axios.get(
      "https://www.snapdeal.com/search?keyword=mobile&santizedKeyword=&catId=&categoryId=0&suggested=false&vertical=&noOfResults=20&searchState=&clickSrc=go_header&lastKeyword=&prodCatId=&changeBackToAll=false&foundInAll=false&categoryIdSearched=&cityPageUrl=&categoryUrl=&url=&utmContent=&dealDetail=&sort=rlvncy"
    );
    const mainHTML = resp.data;
  } catch (err) {
    console.log(err);
    console.log("Error in fetching the products data: " + err);
  }
};
fetchDetails();
cron.schedule("* * 5 * * *", fetchDetails);
app.use("/auth", otpRouter);
app.get("/fetchProduct", async (req, res) => {
  res.send(snapdealProduct);
});
