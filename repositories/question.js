const { readFile } = require('fs/promises')

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
  const addQuestion = async question => {}
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
  const addAnswer = async (questionId, answer) => {}

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
