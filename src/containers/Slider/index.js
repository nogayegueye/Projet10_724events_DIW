import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/dateHelpers";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
 
  // console.log("data:",data)
  const byDateDesc = data?.focus.sort(
    (evtA, evtB) =>
      new Date(evtB.date).getTime() - new Date(evtA.date).getTime()
  )?? [];
 const [index, setIndex] = useState(0);
  const nextCard = () => {
    setTimeout(() => {
      let indextmp = index;
      if (indextmp < byDateDesc.length - 1) {
        indextmp += 1;
      } else {
        indextmp = 0;
      }

      setIndex(indextmp);
    }, 5000);
  };
  useEffect(() => {
    nextCard();
  });

  return (
    
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => {
        const isCurrentSlide = index === idx;
        const cardClassName = `SlideCard ${
          isCurrentSlide ? "SlideCard--display" : "SlideCard--hide"
        }`;
       
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={idx} className={cardClassName}>
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        );
      })}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((event, idx) => (
            <input
              // eslint-disable-next-line react/no-array-index-key
              key={`radio-${idx}`}
              type="radio"
              name="radio-button"
              checked={index === idx}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
