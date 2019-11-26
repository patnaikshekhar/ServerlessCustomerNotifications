module.exports = async function (context, myBlob, blobValue) {
    context.log("JavaScript blob trigger function processed blob \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");
    const rows = blobValue.split('\n')
    const actions = rows.map(row => {
        const columns = row.split(',')
        if (columns.length >= 4) {
            const type = columns[1]
            const location = columns[2]
            const message = columns[3]

            if (type == 'Email') {
                return sendEmail(location, message)
            } else if (type == 'SMS') {
                return sendSMS(location, message)
            } else {
                return null
            }
        }

        return null
    })

    const actualActions = actions.filter(action => action != null)

    await Promise.all(actualActions)
};

async function sendSMS(phoneNumber, message) {
    console.log('Sending SMS to', phoneNumber)
}

async function sendEmail(emailAddress, message) {
    console.log('Sending an Email to ', emailAddress)
}