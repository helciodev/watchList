import { useState } from "react";

export default function Rating({
  maxRating = 5,
  size = 24,
  color = "green",
  textColor = "#fff",
  onRating,
}) {
  const [tempRating, setTempRating] = useState(0);
  const [rating, setRating] = useState(0);
  function handleRating(rating) {
    setRating(rating);
    onRating(rating);
  }
  return (
    <div
      style={{
        display: "flex",
        gap: "3px",
        alignItems: "center",
        alignSelf: "center",
      }}
    >
      <ul style={{ listStyle: "none", display: "flex", gap: "2px" }}>
        {Array.from({ length: maxRating }, (_value, i) => (
          <Star
            key={i}
            color={color}
            size={size}
            onMouseEnter={() => setTempRating(i + 1)}
            onMouseLeave={() => setTempRating(0)}
            onClick={handleRating}
            fill={tempRating > i || rating > i}
            index={i}
          />
        ))}
      </ul>
      <span style={{ fontSize: `${size}px`, color: textColor }}>
        {tempRating ? tempRating : rating ? rating : ""}
      </span>
    </div>
  );
}

function Star({
  color,
  size,
  onMouseEnter,
  onMouseLeave,
  onClick,
  fill,
  index,
}) {
  return (
    <li
      style={{
        height: `${size}px`,
        width: `${size}px`,
        cursor: "pointer",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(index + 1)}
    >
      {fill ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill={color}
          stroke={color}
        >
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke={color}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='{2}'
            d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
          />
        </svg>
      )}
    </li>
  );
}
