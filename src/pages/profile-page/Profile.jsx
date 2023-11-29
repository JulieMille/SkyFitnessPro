import { Header } from '../../components/header/header'
import { ModalProfileChange } from '../../components/ModalProfileChange/ModalProfileChange'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../../App.styles'
import { getDatabase, ref, child, get } from 'firebase/database'
import { Card } from '../../components/CourseCard/Card'
import { setUserCourses } from 'store/slices/userSlice'
import { objArrList } from 'App'

import * as S from './Profile.styles'
import { Link } from 'react-router-dom'

export const Profile = () => {
  const dispatch = useDispatch()
  const [loginChange, setLoginChange] = useState(false)
  const [passwordChange, setPasswordChange] = useState(false)
  const [laoading, setLaoading] = useState(false)
  const { id } = useSelector((state) => state.user)
  const { userCourses } = useSelector((state) => state.user)
  const { email } = useSelector((state) => state.user)

  // запрос на курсы в fireбазе
  const getCourses = () => {
    const dbRef = ref(getDatabase())
    get(child(dbRef, `/users/${id}`))
      .then((snapshot) => {
        const data = snapshot.val()
        if (!userCourses && snapshot.exists()) {
          setLaoading(true)
          dispatch(
            setUserCourses({
              userCourses: data,
            }),
          )
        } else {
          setLaoading(false)
          //  console.log('No data available')
          return
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  getCourses()
  useEffect(() => {
    setLaoading(true)
  }, [])

  return (
    <>
      <Header />
      <S.ProfileInfo>
        <S.Title>Мой профиль</S.Title>
        <S.AllLines>
          <S.Line>Логин: {email}</S.Line>
          {/* <S.Line>Пароль: 4fkhdj880d</S.Line> */}
        </S.AllLines>
        <S.AllButtons>
          <S.ProfileButton onClick={() => setLoginChange(true)}>
            Редактировать логин
          </S.ProfileButton>
          <S.ProfileButton onClick={() => setPasswordChange(true)}>
            Редактировать пароль
          </S.ProfileButton>
        </S.AllButtons>
      </S.ProfileInfo>
      {laoading && !userCourses && <Loader></Loader>}
      {userCourses && <ProfileBlock courses={userCourses}></ProfileBlock>}
      {loginChange && (
        <S.ModalBackground>
          <ModalProfileChange toggleOpen={setLoginChange} text={'Новый логин:'}>
            <S.inputChange placeholder="Логин"></S.inputChange>
          </ModalProfileChange>
        </S.ModalBackground>
      )}
      {passwordChange && (
        <S.ModalBackground>
          <ModalProfileChange
            toggleOpen={setPasswordChange}
            text={'Новый пароль:'}
          >
            <S.inputChange placeholder="Пароль"></S.inputChange>
            <S.inputChange placeholder="Повторите пароль"></S.inputChange>
          </ModalProfileChange>
        </S.ModalBackground>
      )}
    </>
  )
}

export const ProfileBlock = ({ courses }) => {
  // функция преобразования объекта в массив
  const objArrList2 = (data) => {
    let arrList = []
    Object.entries(data).forEach(([key, value]) => {
      arrList.push({ key, value })
    })
    return arrList
  }

  // формируем список курсов
  const coursesList = objArrList2(courses.courses)
  const mapCoursesList = coursesList.map((courseCard, index) => (
    <Card
      key={courseCard.key}
      id={courseCard.key}
      name={courseCard.value}
      position={index + 1}
      typeMain={false}
    ></Card>
  ))

  return (
    <>
      <S.CardPart>
        <S.Title>Мои курсы</S.Title>
        <S.CardList>{mapCoursesList}</S.CardList>
      </S.CardPart>
    </>
  )
}

export const WorkoutSelectionWindow = ({ idCourse }) => {
  const { coursesObj } = useSelector((state) => state.courses)
  const workoutListObj = coursesObj[idCourse].workout

  const workoutListArr = objArrList(workoutListObj)
  //el.id - это айдишник тренировки, передается на страницу воркаута ниже в рендере
  // idCourse - это айдишник курса, если нужен для воркаута, вставить в Link
  return (
    <>
      <S.ModalTitle>Выберите тренировку</S.ModalTitle>
      <S.ModalList>
        {workoutListArr.map((el, index) => {
          return (
            <S.ModalListItem key={index}>
              <Link to={`/workout/${idCourse}/${el.id}`}>
                <S.ModalListLink>
                  <S.TrainingItem>{el.name}</S.TrainingItem>
                  {/* <S.TrainingName>
                    Йога на каждый день / {index + 1} день
                  </S.TrainingName> */}
                  {/* <S.TrainingDone>
                    <svg
                      width="28"
                      height="26"
                      viewBox="0 0 28 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="13.5" r="11.5" stroke="#06B16E" />
                      <path
                        d="M6 9.81034L11.775 15.5L27 0.5"
                        stroke="#06B16E"
                      />
                    </svg>{' '}
                  </S.TrainingDone> */}
                </S.ModalListLink>
              </Link>
            </S.ModalListItem>
          )
        })}
      </S.ModalList>
    </>
  )
}
