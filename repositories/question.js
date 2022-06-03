const { readFile, writeFile } = require('fs/promises')
const { v4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()
    for (const questionIndex in Object.keys(questions)) {
      if (questions[questionIndex].id === questionId) {
        return questions[questionIndex]
      }
    }
    return []
  }
  const addQuestion = async question => {
    const expectedKeys = ['author', 'summary']
    if (Object.keys(question).length != expectedKeys.length) {
      return 'failed'
    }
    for (const key of expectedKeys) {
      if (Object.keys(question).find(value => value === key) === 'undefined') {
        return 'failed'
      }
    }
    question = Object.assign({ id: v4() }, question, { answers: [] })
    const questions = await getQuestions()
    questions.push(question)

    await writeFile(fileName, JSON.stringify(questions), {
      encoding: 'utf-8'
    })
    return 'success'
  }
  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)
    if (question.answers) {
      return question.answers
    }
    return []
  }
  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId)
    for (const answerIndex in Object.keys(answers)) {
      if (answers[answerIndex].id === answerId) {
        return answers[answerIndex]
      }
    }
    return []
  }
  const addAnswer = async (questionId, answer) => {
    const question = getQuestionById(questionId)
    if (question.length === 0) {
      return 'fail'
    }
    const expectedKeys = ['author', 'summary']
    if (Object.keys(answer).length != expectedKeys.length) {
      return 'failed'
    }
    for (const key of expectedKeys) {
      if (Object.keys(answer).find(value => value === key) === 'undefined') {
        return 'failed'
      }
    }
    answer = Object.assign({ id: v4() }, answer)
    const questions = await getQuestions()
    for (const questionIndex in Object.keys(questions)) {
      if (questions[questionIndex].id === questionId) {
        console.log(questions[questionIndex])
        questions[questionIndex].answers.push(answer)
      }
    }

    await writeFile(fileName, JSON.stringify(questions), {
      encoding: 'utf-8'
    })
    return 'success'
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
