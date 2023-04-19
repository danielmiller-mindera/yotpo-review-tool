const fs = require("fs");
const path = require("path");

const reviews = require("./dist/reviews/full.json");

const products = [];

const processData = () => {
    console.log("STARTED CONSUMPTION OF REVIEWS");

    for (const review of reviews) {
        const productsIDs = products.map((product) => product.productID);
        const indexOfProduct = productsIDs.indexOf(review["Product ID"]);

        if (indexOfProduct >= 0) {
            products[indexOfProduct].reviewCount += 1;
            continue;
        }

        products.push({
            productID: review["Product ID"],
            title: review["Product Title"],
            brand: review["Product Brand"],
            URL: review["Product URL"],
            reviewCount: 1
        });
    }
    console.log(`FINISHED CONSUMPTION OF REVIEWS. PRODUCT ARRAY LENGTH: ${products.length}`);
}

const filterByReviewCount = (benchmark = 3) => {
    const unfiltered = [...products];

    const result = unfiltered.filter((product) => product.reviewCount >= 3);

    return result;
}

const outputFile = (name, data) => {
    fs.writeFileSync(path.resolve(__dirname, "dist", "products", `${name}.json`), JSON.stringify(data), "utf-8");
}

const createBrandArray = (array) => {
    const brandsWithLiveReviews = [];

    console.log("STARTED BRAND ARRAY CONSTRUCTION");

    const productsWithBrandField = array.filter((product) => product.brand !== undefined);

    for (const product of productsWithBrandField) {
        const brandNames = brandsWithLiveReviews.map((brand) => brand.name);
        const indexOfBrand = brandNames.indexOf(product.brand);

        if (indexOfBrand >= 0) {
            brandsWithLiveReviews[indexOfBrand].products.push(product);
            continue;
        }

        brandsWithLiveReviews.push({
            name: product.brand,
            products: [product]
        });
    }

    console.log(`FINISHED BRAND ARRAY CONSTRUCTION: ${products.length}`);

    console.log(brandsWithLiveReviews.map((brand) => brand.name));

    return brandsWithLiveReviews;
}

processData();
outputFile("full", products);
const filteredReviews = filterByReviewCount()
outputFile("full_filtered", filteredReviews);

const brandData = createBrandArray(filteredReviews)

outputFile("brand_data", brandData);