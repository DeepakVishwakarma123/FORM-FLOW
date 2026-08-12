import mjml2html from "mjml"
import sendmail from "./sendMail.js"






//this will hold all rows entried inside it as variable 
let emptyTemplateLiteral=`

`
async function convertMJML2HTML(dataToSendINEmail,formTitle) {
    let mjmlFormTitleCode=`
 <mj-head>
NEW FORM SUBMISSION:${formTitle}
</mj-head>
`
    //data to send in email is will become a main template things and for forcing we only send a user 
    //less than or equal to 5 fields
    let dataToSendINEmailFieldKeysArray=Object.keys(dataToSendINEmail)
    
    // don,t care about field limit process each field in submission
        //pass those data into mjml table codes
        for(let FieldKeyName of dataToSendINEmailFieldKeysArray)
        {
            //we grab the object value with thier keys
            let fieldName=FieldKeyName
            let value=dataToSendINEmail[fieldName]
            let tableRowWithUserData=dyanmicRowLiteralmjmlCodeReturn(fieldName,value)
            emptyTemplateLiteral+=tableRowWithUserData
        }      
    
    let mjmlTableStructureCode=` <mj-table>
                                  ${emptyTemplateLiteral}  
                                                        </mj-table>`
   //pass this following htmlString into node mailer to send mails
   let {html:htmlString,errors:mjmlcompileError}=await DynamicFieldValueAdderINmjmlCode(mjmlFormTitleCode,mjmlTableStructureCode) 
//    console.log(htmlString);
//    console.log(mjmlcompileError);
  
  return htmlString
   
//    sendmail(htmlString)
}


function dyanmicRowLiteralmjmlCodeReturn(fieldName,value)
{
    
let rowTemplateLiteralhtmlCode=`
 <tr style="border:1px solid black;">
                <td style="background:gray;padding:8px;">
                ${fieldName}
                </td>
                <td style="background:white;padding:14px">
                ${value}
                </td>
                </tr>
`
return rowTemplateLiteralhtmlCode
}



async function DynamicFieldValueAdderINmjmlCode(mjmlFormTitleCode,mjmlTableStructureCode)
{
let mjmlWholeCode=`
<mjml>
    <mj-body background-color="#ffffff">
    <mj-section>
         <mj-column>
             <mj-image src="https://png.pngtree.com/element_our/20190530/ourmid/pngtree-shuffle-icon-image_1257310.jpg" alt="formsavelogo" width="30px" />
             <mj-text align="center">
                <mj-head>
                FormSave
                </mj-head>
                </mj-text>
                </mj-column>
                </mj-section>
                <mj-section>
                
                <mj-column>
                <mj-text>
                 ${mjmlFormTitleCode}
            </mj-text>
            <mj-text>
            You have received a new submisson here are details
        </mj-text>
        </mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
         ${mjmlTableStructureCode}    
        /mj-column>
      </mj-section>
      <mj-section>
        <mj-column>
        <mj-button>
            View in Dashboard
            </mj-button>
            </mj-column>
      </mj-section>
      <mj-section>
      <mj-column>
            <mj-text align="center"> 
            &#169 2026  formsave All rights reserved
            </mj-text>
            <mj-navbar>
                <mj-navbar-link href="" >
                    Dashboard
                    </mj-navbar-link>
                <mj-navbar-link href="" >
                Privacy Policy
                </mj-navbar-link>
                <mj-navbar-link href="" >
                    Terms And conditions
                </mj-navbar-link>
            </mj-navbar>
        </mj-column>
      </mj-section>
      </mj-body>
</mjml>
      `
let htmlString=await mjml2html(mjmlWholeCode)
// console.log("teh curretn things is now",htmlString);

return htmlString
}


export default convertMJML2HTML