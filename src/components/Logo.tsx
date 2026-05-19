export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Car icon */}
      <path
        d="M6 26H34V30H6V26Z"
        fill="white"
      />
      <path
        d="M4 22L8 14H32L36 22H4Z"
        fill="white"
      />
      <path
        d="M10 14L13 8H27L30 14H10Z"
        fill="white"
        opacity="0.7"
      />
      <circle cx="11" cy="28" r="3" fill="#0a0a0a" stroke="white" strokeWidth="1.5" />
      <circle cx="29" cy="28" r="3" fill="#0a0a0a" stroke="white" strokeWidth="1.5" />
      {/* AUTOFI text */}
      <text
        x="44"
        y="28"
        fontFamily="monospace"
        fontSize="16"
        fontWeight="bold"
        fill="white"
        letterSpacing="2"
      >
        AUTOFI
      </text>
    </svg>
  );
};
