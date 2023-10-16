jest.mock('../db/neo4j', () => ({
    read: jest.fn(),
}));

// Mocking middleware to skip JWT verification for the tests.
jest.mock('../middlewares/verifyJWT', () => (req, res, next) => next());

import { read } from '../db/neo4j';
import handler from '../pages/api/jobs/getAllJobs';

describe('Job API Handler', () => {
    // Clean up and reset mocks after each test to ensure no test side effects.
    beforeEach(() => {
        jest.clearAllMocks();  
    });

    it('should fetch and format all job data successfully', async () => {
        // Arrange
        const mockRecords = [
            {
                toObject: () => ({
                    n: {
                        properties: {
                            jobid: { low: 1 },
                            'Job Role': 'Developer',
                            Sector: 'IT',
                            Track: 'Backend',
                        },
                        elementId: 'some-id'
                    }
                })
            }
        ];
        
        // Mock the `read` function to return our mock records.
        read.mockResolvedValueOnce({ records: mockRecords });

        const mockReq = {};

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Act
        await handler(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            data: [{
                JobId: 1,
                'Job Role': 'Developer',
                Sector: 'IT',
                Track: 'Backend',
                ElementID: 'some-id',
                DisplayName: 'Developer - IT - Backend'
            }]
        });
    });

    it('should return a 500 status code on database error', async () => {
        // Arrange
        read.mockRejectedValueOnce(new Error('Database error'));

        const mockReq = {};

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        // Act
        await handler(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith('Internal server error');
    });
});
