const paginatedList = async (Model, req, res) => {
  try {
    console.log("pagelist dataset");

    // 確保 req.admin._id 存在
    if (!req.admin || !req.admin._id) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID is missing',
      });
    }

    // 解析查詢字段
    const fieldsArray = req.query.fields
      ? req.query.fields.split(',')
      : ['datasetName'];
    const sort = req.query.sort || 'desc';

    // 構建查詢條件，加入 createdBy: req.admin._id
    const query = {
      $and: [{ createdBy: req.admin._id }]
    };

    // 如果有模糊查詢，則加入 $or 條件
    if (req.query.q) {
      const orConditions = fieldsArray.map(field => ({
        [field]: { $regex: new RegExp(req.query.q, 'i') }
      }));

      query.$and.push({ $or: orConditions });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;

    // 查詢資料庫，查詢結果和總數同時執行
    const [result, totalCount] = await Promise.all([
      Model.find(query)
        .sort({ created: sort })
        .skip(skip)
        .limit(limit)
        .exec(),
      Model.countDocuments(query)
    ]);

    const pages = Math.ceil(totalCount / limit);

    // 返回分頁對象
    const pagination = { page, pages, totalCount };

    if (totalCount > 0) {
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
  } catch (error) {
    console.error('Error in paginatedList:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = paginatedList;