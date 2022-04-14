const qacController = require('./qac');
const comment = require('../models/comments');
// console.log(testFunctions);

// ============================ Unit Test ================================== //

function compileErrorCode(msg) {
    throw new Error(msg);
}

// ======================== View Lastest Comment ========================== //
// let testViewLastestComment = testFunctions['viewLastestComment'];
// test('Check view lastest comments', async () => {
//     const listComments = await comment.find();
//     let last_comments = null;
//     const responds = await testViewLastestComment();
//     console.log(responds);
//     console.log('-----------------');
//     if (responds.length <= listComments.length && responds.length > 0) {
//         let n_responds = responds.length;
//         last_comments = listComments.slice(listComments.length-n_responds,listComments.length);
//         for(let i = 0; i < n_responds; i++) {
//             expect(responds[i].time).toBe(last_comments[n_responds-i-1].time.toString().slice(0, -25));
//         }
//     }
//     else {
//         expect(() => compileErrorCode()).toThrow();
//     }
// })

// ======================== Filter Lastest Comment ========================== //
// let testFilterLastestComment = testFunctions['filterLastestComment'];
// test('Check filter lastest comments', async () => {
    
// })\

const mockResponse = () => {
    const res = {};
    res.render = jest.mockReturnValue();
    return res;
}


describe('Test qac controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    const res = mockResponse();
    const req = {

    }

    it('Test get qac', async () => {
        await qacController.getQAC(req, res);
        expect(res.render).toBe(1);
    })
})
