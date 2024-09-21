const paginatedList = async (Model, req, res) => {
  // 解析字段
  const fieldsArray = req.query.fields
    ? req.query.fields.split(',')
    : ['modelName'];
  
  // 確保 req.admin._id 存在
  if (!req.admin || !req.admin._id) {
    return res.status(400).json({
      success: false,
      message: 'Admin ID is missing',
    });
  }

  // 篩選條件，先過濾 createdBy 為 admin ID 的資料
  const fields = {
    $and: [{ createdBy: req.admin._id }] // 加入 createdBy 的條件
  };

  // 如果有搜尋條件，則加入 $or 條件
  if (req.query.q) {
    const orConditions = fieldsArray.map(field => ({
      [field]: { $regex: new RegExp(req.query.q, 'i') }
    }));

    // 將 $or 條件加入到 $and 中
    fields.$and.push({ $or: orConditions });
  }

  ////////////////////
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = (page - 1) * limit;
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
  