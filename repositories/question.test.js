const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: '50cb7124-39ab-4380-b90a-19d9f4eccc7f',
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })
  test('should return object with specified id', async () => {
    expect(
      await questionRepo.getQuestionById('50cb7124-39ab-4380-b90a-19d9f4eccc7f')
    ).toEqual({
      id: '50cb7124-39ab-4380-b90a-19d9f4eccc7f',
      summary: 'Who are you?',
      author: 'Tim Doods',
      answers: []
    })
  })
  test('should return empty list if question with specified id is not found', async () => {
    expect(
      await questionRepo.getQuestionById('this-is-not-even-an-proper-id-123')
    ).toHaveLength(0)
  })
})
