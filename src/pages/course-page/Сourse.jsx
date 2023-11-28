import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ModalWindow,
  ModalSuccess,
} from '../../components/ModalWindow/ModalWindow'
import { Header } from '../../components/header/header'
import { useSelector } from 'react-redux'
import { Loader } from '../../App.styles'
import * as S from './Course.styles'

export const Сourse = () => {
  const { coursesObj } = useSelector((state) => state.courses)
  const { id } = useParams()
  const idCourse = id.slice(0, -1)
  const idImg = id.slice(-1)
  return (
    <>
      <Header />
      {!coursesObj ? (
        <Loader></Loader>
      ) : (
        <CourseBlock course={coursesObj[idCourse]} idImg={idImg}></CourseBlock>
      )}
    </>
  )
}

// формируем блок курса
const CourseBlock = ({ course, idImg }) => {
  const [isSuccessWindow, setSuccessWindow] = useState(false)
  const toggleModalWindow = () => {
    setSuccessWindow((isSuccessWindow) => !isSuccessWindow)
  }

  return (
    <>
      <S.CourseTop>
        <S.CourseImg src={`/img/cardBG_${idImg}.png`} />
        <S.CourseTitle>{course.name}</S.CourseTitle>
      </S.CourseTop>
      <S.CourseAdvantages>
        <S.CourseHeaders>Подойдет для вас, если:</S.CourseHeaders>
        <S.ListAdvantages>
          {course.advantages.map((el, index) => {
            return (
              <S.ItemAdvantages key={index}>
                <div>
                  <S.ItemCircle>{index}</S.ItemCircle>
                </div>
                <S.ItemText>{el}</S.ItemText>
              </S.ItemAdvantages>
            )
          })}
        </S.ListAdvantages>
      </S.CourseAdvantages>
      <S.CourseDirections>
        <S.CourseHeaders>Направления:</S.CourseHeaders>
        <S.ListDirections>
          {course.directions
            .slice(1, -1)
            .split(', ')
            .map((el) => {
              return <S.ItemDirections key={el}>{el}</S.ItemDirections>
            })}
        </S.ListDirections>
      </S.CourseDirections>
      <S.CourseDescription>{course.description}</S.CourseDescription>
      <S.Footer>
        <S.FooterLeft>
          <S.FooterText>
            Оставьте заявку на пробное занятие, мы свяжемся с вами, поможем с
            выбором направления и тренера, с которым тренировки принесут
            здоровье и радость!
          </S.FooterText>
          <S.FooterButton onClick={toggleModalWindow}>
            Записаться на тренировку
          </S.FooterButton>
        </S.FooterLeft>
        <S.FooterImg src="/img/handset.png" alt="handset" />
      </S.Footer>

      {isSuccessWindow && (
        <ModalWindow
          setSuccessWindow={setSuccessWindow}
          childComponent={<ModalSuccess text={'Вы успешно записались!'} />}
        />
      )}
    </>
  )
}
