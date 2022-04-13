const qacController = require('../controller/qac');


jest.useFakeTimers()
const mockResponse = () => {
  const res = {};
  res.send = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.download = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  return res;
};

describe('Test qac controller', () => {
  describe('Test get qac', () => {
    it('it should abcxyz', async () => {
      const req = {
        session: {
          email: 'Test@gmail.com'
        }
      };
      const res = mockResponse();
      await qacController.getQAC(req, res);

      expect(res.render).toHaveBeenCalledWith("qac/index", {"loginName": "Test@gmail.com"});
    })
  })
})
