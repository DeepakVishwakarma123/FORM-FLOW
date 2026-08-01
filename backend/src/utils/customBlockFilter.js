  let bodyObject = {
    "ff-text-random1": "hello this is basic text",
    "ff -text-comment": "just a random comment here",
    "ff-number-age": 27,
    "ffnumber-quantity": 150,
    "ff-email-contact": "test@example.com",
    "ff -email-user2": "randomuser99@mail.com",
    "ff-phone-num": "9876543210",
    "ff phone-alt": "+91-9123456780",
    "ff-url-s": "hello",
    "ff -url-sitename": "kartika aryana",
    "ff-select-option": "option2",
    "ffselect-choice": "yes",
    "ff-rating-star": 4,
    "ff -rating-score": 3.5,
    "ff-date-dob": "2001-05-14",
    "ffdate-event": "2026-08-15",
    "ff-country-loc": "India",
    "ff -country-origin": "USA",
    "ff-hello-cine": "hello cienam",
    "ff-hello-cine": "hello cienam",
    "f f":"ki",
    "url-h":"sello"
}

        /*
        custom block are below this is gone fixed it not can be any random value if strig or field name doesn,t
        has these value then it can,t allowed to be for form validation and as custom field for a forms */

        /*
        text
        number
        email
        phone
        url
        select
        rating
        date
        country
        */

        let pattern=/^[f]{2}-[a-z]+-[a-z]+$/

        //first step is to get out of only valid fields from body object 
        //show my first consider is that field start with ff character
        //let's do this by regular expresson
        //before it let's bring out all the keys from object by using method object.keys
        let requestFields=Object.keys(bodyObject)

        //let's pick those element only in array who has proper syntax of starting with ff criteria
        //i do filter by using filter method and using regexp pattern syntax
        //this is wrong i think so 
        let validFieldNames=requestFields.filter(
            (fieldNames) => {
                return pattern.test(fieldNames)===true
            }
        )
        console.log("valid field names are",validFieldNames);
        
        console.log(requestFields)