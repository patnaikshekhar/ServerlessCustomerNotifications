module.exports = async function (context, myBlob, blobValue) {
    context.log("JavaScript blob trigger function processed blob \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");
    console.log(blobValue)
};