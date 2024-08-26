const paginatedList = async (Model, req, res) => {
  /////////////////////////////
  const fieldsArray = req.query.fields
    ? req.query.fields.split(',')
    : ['modelName'];

  const fields = { $and: [{  }, { $or: [] }] };
  
  let findedCount = 0;
  for (const field of fieldsArray) {
    fields.$and[1].$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
    findedCount = findedCount+1;
    }
  ////////////////////
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  /////////
    //  Query the database for a list of all results
    const resultsPromise = Model.find(fields)
  //    .skip(0)
  //    .limit(limit)
      .sort({ created: 'desc' })
      .exec();
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
      return res.status(204).json({
        success: false,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  };
  
  module.exports = paginatedList;
  