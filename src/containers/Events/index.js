import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const filteredEvents = ((!type ? data?.events : data?.events) || [])
    .filter((event) => {
      if (!type || event.type === type) {
        return true;
      }
      return false;
    })
    .filter((event, index) => {
      if (
        (currentPage - 1) * PER_PAGE <= index &&
        PER_PAGE * currentPage > index
      ) {
        return true;
      }
      return false;
    });
  const changeType = (eventType) => {
    setCurrentPage(1);
    setType(eventType);
  };
  const changePage = (event, pageNumber) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select selection={Array.from(typeList)} onChange={changeType} />

          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              <a
                 key={`page-${n + 1}`}
                href="#events"
                onClick={(event) => changePage(event, n + 1)}
                className={currentPage === n + 1 ? "active" : ""}
              >
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
