/*
    In Controller.js V define the route handler functions
    Here V will perform the CRUD operations related to the tour
*/

/*
  V have defined the Schema and the model in "tourModel.js" and in that file V have exported it 
  Here V R importing it so that both, 
    Schema and Model (i.e definitions) should be in 1 file and 
    operations: related to the Model can be in this file
*/
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


// Defining "aliasTopTours" MW
exports.aliasTopTours = (req, res, ,next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  /*
    What I wants to do when a new object of this class is created ?
      I will pass 2 object, 
        "query": This is mongoose query
            Why V R passing the query?
              Bcoz V don't wants to query inside the class and by doing this, it will bound this class with the "tour" resource. V R making this dynamic which will help to make this component reusable 
        "queryString": This is "express" string or the string which V will get from the route or which V access through "req.query"

    Now V will define individual functions for each features
  */


  // for filter
  filter() {

  }

}

// Refactoring: Now each function is available inside the class
exports.getAllTours = async (req, res) => {
  try {  
    // ========= QueryString  ========= .
    // These starts with "?" in the route url
    console.log(req.query);
    // "req.body" will give us the query object entered by the user. V R allowing the user to apply query on "getAllTours" route (which has all details of all tours) so that user have accessebility to filter his query from the whole data

    /*
        In mongoose V have 2 ways to write DB queries
            1st: is to use a filter object inside the find() method. 
            Ex:
                const tours = await Tour.find({
                    duration: 5,
                    difficulty: 'easy'
                })
            
            2nd: chaining mongoose methods on find()
                const tours = await Tour.find()
                .where('duration')
                .equals(5)
                .where('difficulty')
                .equals('easy');
        */

    // const tours = await Tour.find(req.query);
    // this query is very simple but V can also call for "sort" or "pagination" in the url and using these ("sort/pagination/limit") in the query has no relation to DB(bcoz they R not stored in DB then why to send them with the query). So V need to exclude these types of params from the URL before V do the filtering of the required query in DB
    /*
        How do V do this?
            * Create a shallow copy of req.query obj
            * Create an array of all the fields which V wants to exclude
            * Loop through the array of excluded elements and for each array element delete the ele if it is also present in the given query. For ex: if "limit" is present in query and V have also added it into the excluded items then the "limit" will be deleted from the query and V will be having the query which V wants as a result. (V will use forEach bcoz V don't want to save the edited items in new array). In the forEach V will TR through the array and for each element V will delete that ele from the "queryObj" by using "delete" operator          
    */

    // *******  *******  ******* 1. Filtering  *******    *******    *******
    // ======== ========  ======== ========   ======== ========
    // 1A: ======== simple filtering

    // Buidling the "query"
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    console.log(req.query, queryObj);

    // 1B: ====== Advanced filtering  ========
    /*
        * How do V write query which has operator like less than, greater than, or equals, in MDB
        * {difficulty: 'easy', duration: {$gte: 5}}     
        * this query will return all the results with easy difficulty and duration >= 5       
        * Now to use this into the url V just need to add "[gte]" for difficulty. 
            For Ex: "127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5" if V have applied this query in the URL and the if V log it "req.query" then V will get "{ difficulty: 'easy', duration: { gte: '5' } }"
        * So the only differce in MDB query and log query is "$" i.e 
            MDB: {difficulty: 'easy', duration: {$gte: 5}} 
            Logged query: "{ difficulty: 'easy', duration: { gte: '5' } }"
            and V need to create MDB query string from the url string
        * In a nutshell V need to apply the "$" in the logged query so that it can be used for searching from the DB
        * v will use regex 
    */

    /*
        1st: Convert the query obj to the String(using stringify)
        replace the the character from the string with the right character. Here V R replacing "gte", gt, lte, lt and to replace these V will use regular expression       
    */
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr)); // getting the obj from the String
    /*
       in the regular expression:
          re starts with "/" and ends with "\"
          "\b": to match the exact same words ("gte|gt|lte|lt") in the string      
          g: will replace all the instances of these words from the string and if V don't use this then only 1st instaces of these will be removed
          
        replace():
           it takes a callback function and for that V have used "match" var which this callback function will take as arg. Then V R adding "$" symbol in front of the string contained in the "match" var         
    */

    // so now instead of passing the unmodified queryObj like "const tours = await Tour.find(req.query)" V will send the modified queryObj
    // const tours = await Tour.find(queryObj);   // A
    // on "A" V can't use chaining of methods bcoz "A" will send a complete query as V have used "await" over there
    /*
        So to fix this situation V will 1st get the desired query (B) from the DB and then use await on it  (C)          
    */
    // const query = Tour.find(queryObj); // B
    // now using the updated query with "$" sign
    let query = Tour.find(JSON.parse(queryStr)); // B

    // *******  *******  ******* 2. Sorting  *******    *******    *******
    // ======== ========  ======== ========   ======== ========
    /*
       How do V implement the sorting ?             
          1st V will check if the "sort" is requested by the user or not
          then V will sort the query according to the sorting para (which will be saved into the "sort" var of the url)            
    */
    if (req.query.sort) {
      query = query.sort(req.query.sort);
      /*
        Why V R able to apply "sort()" on "query" ?
          Bcoz "find()" will return a query and on that "query" V can apply the "sort()". And similar to this V can chain more methods to the "query"

          Here:
            asc order: "127.0.0.1:3000/api/v1/tours?sort=price"
            desc order: "127.0.0.1:3000/api/v1/tours?sort=-price" with a minus sign

        How do V set a criteria if there is a tie between 2 results
          in the url V can specify the 2nd para preceeding with a comma
          Ex: " 127.0.0.1:3000/api/v1/tours?sort=price,ratingsQuantity"
          Then to TR the MDB replace the comma with a space
          How do V do this ?
              1st: V split the string by using "," as a delimeter. For this V will use "split()" and it returns an array of separated items.
              Then V will join all of the individual items using "join()" and space as a delimeter

              const sortBy = req.query.sort.split(',').join(' ');
              console.log(sortBy);
              query = query.sort(sortBy);

      */      
    }

    // Here setting a default sorting order, if the user will not apply sorting then V will sort here by the "createdAt" time, means all the latest tour will appear first
    else {
      query = query.sort('-createdAt');
    }



    /* *******  *******  ******* 2. Field Limiting  *******    *******    *******
     ======== ========  ======== ========   ======== ========   ======== ========
      Field limiting: which fields user wants back as a response. For a client is always better to deliver as little data as possible so that the bandwidth will be small. 
      Ex: if the user only wants "name || duration || difficulty" than he needs to be delivered the docs which contains the above fields only
     
      How do V do this ?
        1st V will store all the var which are specified in the URL and split them and combine them using using join
        V will use "select()", which will take params as string separated by space and send back the results from the query which contains the specified strings. This operation is k/a "Projecting" 
    */
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);     
        // this can also be written as "query.select('name duration price)" => this will return the queries which contains these fields only
    } 
    // if the user doesn't apply Projecting, then V will send a default response
    else {
        query = query.select('-__v');   // this will hide "__v" fields from every doc as V have used "minus" befoe "__v" in the select => when V will use minus in front of any field in the select() than that will not be shown to the user 
    }
    /*
      V can also apply the "Projection" on he Schema itself. Ex: when V don't wants to show(or deliver with the response) the passwords to the user 
      Suppose for now V dont' wants the user to see when a tour was created i.e "createdAt". For this V will be using "select: false" in the Schema
    */


  /* *******  *******  ******* 4. Pagination  *******    *******    *******
    ======== ========  ======== ========   ======== ========   ======== ========
      How V R going to implement "Pagination" using our query string ?
        V use "page"(on which page V wants to go) and "limit"(results per page) fields
        
  */

    // V need to define a default pagination also in case if the user haven't used pagination and V have 1million results so V shoudn't be sending all to the user in 1 call
    // "* 1" will convert the string into num and used "or" operator here bcoz if the user don't specify any page then V will set page as default as 1
    const page = req.query.page * 1 || 1;  
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
 
    query = query.skip(skip).limit(limit); 
    /*
    query = query.skip(10).limit(10);
        Here: limit(10): means that each page should have 10 results per page only.
        Now according to the limit V need to set the "skip()".
        Ex: page=2&limit=10: If 1 page contains 10 res and suppose V wants to go to the 2nd page then V will skip 1st 10 results in the DB so that the 2nd page can show results from 11-20 
        Similarly if V wants to go to the 3rd page then v need to skip first 20 res so that 3rd page can show res from 21-30
    */

    /*
        If the user is trying to access the page which doesn't exists
        "Tour.countDocuments()" will return a promise and that's why V R using "await"
    */
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip > numTours) throw new Error("This page doesn't exist");
    }
    /*
      Why R V throwing an error instead of sending a "fail" response ?
        Bcoz V R in try block and as soon as V throw an error, the control will be transferred to the catch block 
    */




    // Executing the query
    const tours = await query; // C

    // ========= Normal getAllTours function =========
    // "find()" returns a promise
    // const tours = await Tour.find();

    // Send response
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // here "findById()" will work same as if V use this: Tour.find({_id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // 2 methods to create and save new doc to DB
    // M-1: Define a new tour and then save it
    // const newTour = new Tour({});
    // newTour.save()

    // M-2: call the "create()" on the model itself.
    // the "create()" returns a promise but instead of handling promise V will use "async await"
    const newTour = await Tour.create(req.body);
    // Here "req.body" this is the data that will be passed by the user

    res.status(201).send({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // Think about the error V can get from the try block i.e here V R creating a new doc then which kind of error V can get if V fail to create a new doc
    // As defined in the schema, here validation err can come
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
//  use try-catch with async-await

exports.updateTour = async (req, res) => {
  try {
    /*
            Params list:
            1st argument: which doc V wants to update
            2nd arg: from whom to update with
            3rd arg: "new: true" will return the new updated doc
            4th arg: "runValidators: true" will again run the validators which V have used in our Schema definition. Ex: if V put "price": "save price" then as V have again run the Validator so mongoose will again check if the sent doc is correct or not which is here for "price", it needs to be a number => so mongoose will through an error
        */
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // runValidators: true
    });
    // Here V R using "patch" req in postman but if V will use "put" req then V need to provide the whole Schema with values in the postman and it will replace the whole Tour object in DB. So B sure when providing the field only which needs to be updated then use "patch" and if usign "post" then provide the whole JSON in postman

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    // In delete operation V don't send any data to the client in the delete operation
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Enter a valid ID',
    });
  }
};






























