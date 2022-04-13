const qamController = require('../controller/qam');
const idea = require('../models/ideas');
const comment = require('../models/comments');
const staff = require('../models/staff');
const fs = require("fs");
const Category = require('../models/category');


jest.useFakeTimers()
const mockResponse = () => {
  const res = {};
  res.send = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.download = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

describe('Test qam controller', () => {
  describe('Test get qam', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    })
    it('it should return view route and data', async () => {
      const req = {
        session: {
          email: 'Test@gmail.com'
        }
      };
      const res = mockResponse();
      await qamController.getQAM(req, res);

      expect(res.render).toHaveBeenCalledWith("qam/qam_index", {"loginName": "Test@gmail.com"});
    })
  })

  describe('Test get add category', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    })
    it('it should return view route and data', async () => {
      const req = {
        session: {
          email: 'Test@gmail.com'
        }
      };
      const res = mockResponse();
      await qamController.getAddCategory(req, res);

      expect(res.render).toHaveBeenCalledWith("qam/qamAddCategory", {"loginName": "Test@gmail.com"});
    })
  })

  describe('Test do add category', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    })
    it('it should return view route and data', async () => {
      const req = {
        body: {
          name: 'Test',
          description: 'Test',
        }
      };
      const res = mockResponse();

      jest.spyOn(fs, 'access').mockResolvedValueOnce(true)

      jest.spyOn(Category, 'create').mockResolvedValueOnce({
        name: 'Test',
        description: 'Test',
        // co the add field bat ki vi minh dang gia lap truy van
      });

      // sau khi mock het roi, va truyen du data de pass cac logic thi goi function
      await qamController.doAddCategory(req, res);
      expect(res.redirect).toHaveBeenCalledWith("/qam_index");
    })
  })
})
