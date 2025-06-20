import ColorPalets from "../ColorPalets";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";


interface Props {
  name?: string;
  hours?: string;
  averageLevel?: string;
  favoriteSubjects?: string[];
  nextExam?: Date;
  recomendedSubjects?: string[];
  countdown?: number;
}

function UserCard({ user }: { user: Props }) {
  return (
        <div
          className="user-card p-5 w-64 rounded-2xl shadow-md flex flex-col text-left gap-4"
          style={{ backgroundColor: ColorPalets.primaryLight, color: ColorPalets.textPrimary }}
        >
          <h2 className="text-xl font-bold">{user.name ?? "Unbekannter Schüler"}</h2>

          <div style={{ backgroundColor: ColorPalets.primary }} className="rounded-2xl p-4">
            <p>Stunden: {user.hours ?? "Keine Angabe"}</p>
          </div>

          <div style={{ backgroundColor: ColorPalets.primaryDark }} className="rounded-2xl p-4 text-white">
            <p>Durchschnittliches Level: {user.averageLevel ?? "Nicht bewertet"}</p>
          </div>

          {user.favoriteSubjects && user.favoriteSubjects.length > 0 ? (
            <div style={{ backgroundColor: ColorPalets.primary }} className="rounded-2xl p-4">
              <p>Lieblingsfächer:</p>
              <ul className="list-disc pl-5">
                {user.favoriteSubjects.map((subject, index) => (
                  <li key={index}>{subject}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Keine Lieblingsfächer angegeben</p>
          )}

          {user.nextExam && (
            <div style={{ backgroundColor: ColorPalets.primaryDark }} className="rounded-2xl p-4 text-white">
              <p>Nächste Prüfung: {user.nextExam.toLocaleDateString("de-DE")}</p>
            </div>
          )}

          {user.recomendedSubjects && user.recomendedSubjects.length > 0 ? (
            <div style={{ backgroundColor: ColorPalets.primary}} className="rounded-2xl p-4">
              <p>Empfohlene Fächer:</p>
              <ul className="list-disc pl-5">
                {user.recomendedSubjects.map((subject, index) => (
                  <li key={index}>{subject}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Keine empfohlenen Fächer angegeben</p>
          )}

          {user.countdown !== undefined && (
            <div style={{ backgroundColor: ColorPalets.primary }} className="rounded-2xl p-4">
              <p>Countdown: {user.countdown} Tage</p>
            </div>
          )}
</div>

  );
}

export default UserCard;
