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
        answers: [
          {
            id: 'f080d447-d185-4b13-8d9e-34d04980e8a6',
            author: 'Anakin Earthwalker',
            summary: 'I am your father.'
          },
          {
            id: 'fa309210-b8fd-4065-ace3-73dce62f6014',
            author: 'Luke Mattews',
            summary: 'I am a postman. Here is your mail.'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return question object with specified id', async () => {
    expect(
      await questionRepo.getQuestionById('50cb7124-39ab-4380-b90a-19d9f4eccc7f')
    ).toEqual({
      id: '50cb7124-39ab-4380-b90a-19d9f4eccc7f',
      summary: 'Who are you?',
      author: 'Tim Doods',
      answers: [
        {
          id: 'f080d447-d185-4b13-8d9e-34d04980e8a6',
          author: 'Anakin Earthwalker',
          summary: 'I am your father.'
        },
        {
          id: 'fa309210-b8fd-4065-ace3-73dce62f6014',
          author: 'Luke Mattews',
          summary: 'I am a postman. Here is your mail.'
        }
      ]
    })
  })

  test('should return question list of 0 if question with specified id is not found', async () => {
    expect(
      await questionRepo.getQuestionById('this-is-not-even-an-proper-id-123')
    ).toHaveLength(0)
  })

  test('should return answers list of 2 from question with specified id', async () => {
    expect(
      await questionRepo.getAnswers('50cb7124-39ab-4380-b90a-19d9f4eccc7f')
    ).toHaveLength(2)
  })

  test('should return question list of 0 if question with specified id is not found', async () => {
    expect(
      await questionRepo.getAnswers('this-is-not-even-an-proper-id-123')
    ).toHaveLength(0)
  })

  test('should return answer object with specified id', async () => {
    expect(
      await questionRepo.getAnwerById(
        '50cb7124-39ab-4380-b90a-19d9f4eccc7f',
        'f080d447-d185-4b13-8d9e-34d04980e8a6'
      )
    ).toEqual({
      id: 'f080d447-d185-4b13-8d9e-34d04980e8a6',
      author: 'Anakin Earthwalker',
      summary: 'I am your father.'
    })
  })

  test('should return anwer list of 0 if question or answer with specified id is not found', async () => {
    expect(
      await questionRepo.getAnswer(
        'this-is-not-even-an-proper-id-123',
        'this-is-not-even-an-proper-id-123'
      )
    ).toHaveLength(0)
    expect(
      await questionRepo.getAnswer(
        '50cb7124-39ab-4380-b90a-19d9f4eccc7f',
        'this-is-not-even-an-proper-id-123'
      )
    ).toHaveLength(0)
  })
})
