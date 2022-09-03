const AWS = require('aws-sdk')
const SES = new AWS.SES()
const processResponse = require('./process-response.js')
const nodemailer = require('nodemailer')
const Email = require('email-templates')

const roundToNearest = (value, step) => {
  return Math.round(value / step) * step
}

const formatJPY = number =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })
    .format(number)
    .slice(1) //To remove the curency symbol

const formatUSD = number =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })
    .format(number)
    .slice(1)

const jpyToUSD = (yen, exchangeRate) => {
  const STEP = 200
  return formatUSD(roundToNearest(yen * exchangeRate, STEP))
}

let transporter = nodemailer.createTransport({
  SES: { ses: SES, aws: AWS }
})

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return processResponse(true)
  }

  let { body } = event

  if (!body) {
    return processResponse(true, 'Missing email parameters', 400)
  }

  body = typeof body === 'string' ? JSON.parse(body) : body

  console.log('Body:', body, typeof body)

  /*if (!emailData.toEmails || !Array.isArray(emailData.toEmails) || !emailData.subject || !emailData.message) {
                                                return processResponse(true, 'Please specify email parameters: toEmails, subject and message', 400);
                                              }*/

  /*const createRecruiterEmail = ({
                              sender,
                              email,
                              message,
                              fromCompany,
                              fromAgency,
                              role,
                              salaryLower,
                              salaryUpper,
                              benefitFullRemote,
                              benefitHybridRemote,
                              benefitFlexibleHours,
                              benefitOther,
                              recruiting
                            }) => {
                              return ''
                            }*/

  try {
    /*
                                                                        await transporter.sendMail({
                                                                          from: process.env.FROM_EMAIL,
                                                                          to: process.env.TO_EMAIL,
                                                                          subject: `Email from ${body.sender} at ${body.email}`,
                                                                          text: body.recruiting ? createRecruiterEmail(body) : body.message
                                                                        })*/
    const email = new Email({
      message: {
        from: process.env.FROM_EMAIL
      },
      send: true,
      transport: transporter
    })

    await email.send({
      template: body.recruiting ? 'recruiting' : 'default',
      message: {
        to: process.env.TO_EMAIL
      },
      locals: {
        ...body,
        jpySalaryRange: `¥ ${formatJPY(Number(body.salaryLower))} - ${formatJPY(
          body.salaryUpper
        )}
        `,
        usdSalaryRange: `$ ${jpyToUSD(
          body.salaryLower,
          body.exchangeRate ?? 0.0072
        )} -
          ${jpyToUSD(body.salaryUpper, body.exchangeRate ?? 0.0072)}
        `
      }
    })
    return processResponse(true)
  } catch (err) {
    console.error(err, err.stack)
    const errorResponse = `Error: Execution update, caused a SES error, please look at your logs.`
    return processResponse(true, errorResponse, 500)
  }

  //await SES.sendEmail(emailParams).promise();
}

/*function isHTML(value) {
  value = value.trim();
  return value.startsWith('<') && value.endsWith('>') &&
    (value.includes('<body') || value.includes('<div') || value.includes('<s') || value.includes('<h') || value.includes('<p'));
}*/
