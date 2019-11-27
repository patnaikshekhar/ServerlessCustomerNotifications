const twilioAccountSid = process.env.TWIL_ACCOUNT_ID
const twilioAuthToken = process.env.TWIL_AUTH_TOKEN
const twilioSendingNumber = process.env.TWIL_SENDING_NUMBER
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken)
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
    try {
        console.log('Sending SMS to', phoneNumber)
        const messageID = await twilioClient.messages.create({
            body: message,
            from: twilioSendingNumber,
            to: phoneNumber
        })
        console.log('Twilio Message ID', messageID)
    } catch(e) {
        console.error(e)
    }
}

async function sendEmail(emailAddress, message) {
    try {
        console.log('Sending an Email to ', emailAddress)
        const msg = {
            to: emailAddress,
            from: 'patnaikshekhar@gmail.com',
            subject: message,
            text: message,
            html: message,
        }

        const response = await sgMail.send(msg)

        console.log('Response from SendGrid', response)
    } catch(e) {
        console.error(e)
    }
}