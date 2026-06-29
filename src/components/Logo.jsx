export default function Logo({ className = "h-8 w-8" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="8" cy="22" r="5" fill="#1a56db" />
      <circle cx="24" cy="10" r="5" fill="#0e9f6e" />
      <path
        d="M11.5 18.5C14 14 18 11.5 21 10.5"
        stroke="#1a56db"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
