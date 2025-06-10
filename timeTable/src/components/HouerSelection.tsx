import Courses from "../data/CoursesData";
import ColorPalets from "./ColorPalets";

//wird noch geändert grade nur test weise
//auf eine datenbank

function HouerSelection() {
  return(
    <div className="flex flex-col items-center rounded-lg shadow-lg overflow-auto max-h-[80vh]">
      <div
        className="flex flex-col items-center scrollbar-hide"
        style={{
          background: ColorPalets.primaryLight,
          color: ColorPalets.textPrimary,
          borderRadius: "0.5rem",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
          overflowY: "auto",
          maxHeight: "80vh"
        }}
      >
        {Courses.map((hourCourses, hourIdx) => {
          const houerCounter = `Stunde ${hourIdx + 1}`;
          return (
            <div key={hourIdx} className="mb-6">
              <div
                className="text-center font-bold text-lg mb-2"
                style={{
                  background: ColorPalets.primaryLight,
                  color: ColorPalets.textPrimary
                }}
              >
                --- {houerCounter} ---
              </div>
              <div
                className="grid grid-cols-3 gap-4 rounded-lg p-4 shadow"
                style={{
                  background: ColorPalets.primaryLight,
                  color: ColorPalets.textPrimary,
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
                }}
              >
                {hourCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`
                      p-3 rounded-lg mb-4 
                      shadow-md hover:shadow-xl
                      hover:cursor-pointer duration-75 ease-in-out transition-all
                      hover:scale-110
                      hover:shadow-lg transition-shadow duration-200 ease-in-out
                      ${course.color}
                    `}
                  >
                    <h3 className="font-bold">{course.name}</h3>
                    <p>{course.info}</p>
                    <p>Lehrer: {course.teacher}</p>
                    <p>Maximale Teilnehmer: {course.maxMembers}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HouerSelection;