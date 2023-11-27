import { Header } from '../../components/header/header'
import { ModalProfileChange } from '../../components/ModalProfileChange/ModalProfileChange'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader } from '../../App.styles'
import { getDatabase, ref, onValue, child, get } from 'firebase/database'
import { Card } from '../../components/CourseCard/Card'
import { setUserCourses } from 'store/slices/userSlice'
import * as S from './Profile.styles'

export const Profile = () => {
  const dispatch = useDispatch()
  const { id } = useSelector((state) => state.user)
  const { userCourses } = useSelector((state) => state.user)

  // запрос на курсы в fireбазе
  const dbRef = ref(getDatabase())
  get(child(dbRef, `/users/${id}`))
    .then((snapshot) => {
      const data = snapshot.val()
      if (!userCourses && snapshot.exists()) {
        dispatch(
          setUserCourses({
            userCourses: data,
          }),
        )
      } else {
        // console.log('No data available')
        return
      }
    })
    .catch((error) => {
      console.error(error)
    })

  return (
    <>
      <Header />
      {!userCourses ? (
        <Loader></Loader>
      ) : (
        <ProfileBlock courses={userCourses}></ProfileBlock>
      )}
    </>
  )
}

export const ProfileBlock = ({ courses }) => {
  const [loginChange, setLoginChange] = useState(false)
  const [passwordChange, setPasswordChange] = useState(false)
  const { email } = useSelector((state) => state.user)

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
      <S.CardPart>
        <S.Title>Мои курсы</S.Title>
        <S.CardList>
          {mapCoursesList}
          {/* <S.Card>
            <S.Image src="/img/cardBG_1.png"></S.Image>
            <S.RedirectButton>Перейти →</S.RedirectButton>
            <S.TitleCard>Йога</S.TitleCard>
          </S.Card>
          <S.Card>
            <S.Image src="/img/cardBG_2.png"></S.Image>
            <S.RedirectButton>Перейти →</S.RedirectButton>
            <S.TitleCard>Стречинг</S.TitleCard>
          </S.Card>
          <S.Card>
            <S.Image src="/img/cardBG_5.png"></S.Image>
            <S.RedirectButton>Перейти →</S.RedirectButton>
            <S.TitleCard>Бодифлекс</S.TitleCard>
          </S.Card> */}
        </S.CardList>
      </S.CardPart>
      {loginChange ? (
        <S.ModalBackground>
          <ModalProfileChange toggleOpen={setLoginChange} text={'Новый логин:'}>
            <S.inputChange placeholder="Логин"></S.inputChange>
          </ModalProfileChange>
        </S.ModalBackground>
      ) : (
        ''
      )}
      {passwordChange ? (
        <S.ModalBackground>
          <ModalProfileChange
            toggleOpen={setPasswordChange}
            text={'Новый пароль:'}
          >
            <S.inputChange placeholder="Пароль"></S.inputChange>
            <S.inputChange placeholder="Повторите пароль"></S.inputChange>
          </ModalProfileChange>
        </S.ModalBackground>
      ) : (
        ''
      )}
    </>
  )
}
