const paginatedList = async (Model, req, res) => {
  /////////////////////////////
    const fieldsArray = req.query.fields
      ? req.query.fields.split(',')
      : ['label'];
  
    const fields = { $and: [{ removed: false }] }; // Add the removed filter here
    let findedCount = 0;
    for (const field of fieldsArray) {
      fields.$and.push({ $or: [] });
      fields.$and[1].$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
      findedCount = findedCount+1;
    }
  ////////////////////
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  /////////
    //  Query the database for a list of all results
    const resultsPromise = Model.find(fields)
  //    .skip(0)
  //    .limit(limit)
      .sort({ created: 'desc' })
      .populate('filename', 'label')
      .exec();
    // Counting the total documents
    //const countPromise = Model.countDocuments(fields);
    // Resolving both promises
    //const [result, count] = await Promise.all([resultsPromise, countPromise]);
    const [result] = await Promise.all([resultsPromise]);
  
    // Calculating total pages
    const pages = Math.ceil(findedCount / limit);
  
    // Getting Pagination Object
    const pagination = { page, pages, findedCount };
    if (findedCount > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  };
  
  module.exports = paginatedList;
  