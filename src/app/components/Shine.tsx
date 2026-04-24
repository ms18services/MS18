import type { SVGProps } from "react";

type ShineProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export default function Shine({ title, ...props }: ShineProps) {
  return (
    <svg
      width="586"
      height="866"
      viewBox="0 0 586 866"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <style>{`
        @keyframes shine-sparkle-a {
          0%, 100% {
            transform: scale(0.88);
          }
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes shine-sparkle-b {
          0%, 100% {
            transform: scale(1.08);
          }
          50% {
            transform: scale(0.88);
          }
        }
      `}</style>
      <g
        style={{
          animation: "shine-sparkle-a 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      >
        <path
          d="M361.754 136.168C365.671 111.529 401.136 111.529 405.054 136.168L428.815 285.618C430.03 293.258 435.183 299.693 442.373 302.549L528.44 336.735C547.55 344.326 546.635 371.68 527.061 377.977L443.68 404.802C435.772 407.346 429.981 414.143 428.724 422.355L405.073 576.928C401.278 601.737 365.53 601.737 361.734 576.928L338.083 422.355C336.827 414.143 331.036 407.346 323.127 404.802L239.747 377.977C220.172 371.68 219.258 344.326 238.368 336.735L324.435 302.549C331.625 299.693 336.777 293.258 337.992 285.618L361.754 136.168Z"
          fill="#279EFF"
        />
        <g filter="url(#filter0_n_394_326)">
          <path
            d="M361.754 136.168C365.671 111.529 401.136 111.529 405.054 136.168L428.815 285.618C430.03 293.258 435.183 299.693 442.373 302.549L528.44 336.735C547.55 344.326 546.635 371.68 527.061 377.977L443.68 404.802C435.772 407.346 429.981 414.143 428.724 422.355L405.073 576.928C401.278 601.737 365.53 601.737 361.734 576.928L338.083 422.355C336.827 414.143 331.036 407.346 323.127 404.802L239.747 377.977C220.172 371.68 219.258 344.326 238.368 336.735L324.435 302.549C331.625 299.693 336.777 293.258 337.992 285.618L361.754 136.168Z"
            fill="url(#paint0_linear_394_326)"
          />
        </g>
      </g>
      <g
        style={{
          animation: "shine-sparkle-b 2.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      >
        <path
          d="M134.252 431.966C137.172 413.603 163.603 413.603 166.523 431.966L184.232 543.349C185.138 549.043 188.978 553.839 194.336 555.967L258.481 581.446C272.723 587.103 272.042 607.49 257.453 612.183L195.311 632.175C189.417 634.071 185.101 639.136 184.165 645.257L166.538 760.458C163.709 778.947 137.067 778.947 134.238 760.458L116.611 645.257C115.675 639.136 111.359 634.071 105.465 632.175L43.3222 612.183C28.7339 607.49 28.0523 587.103 42.2947 581.446L106.439 555.967C111.798 553.839 115.638 549.043 116.543 543.349L134.252 431.966Z"
          fill="#3DA8FF"
        />
        <g filter="url(#filter1_n_394_326)">
          <path
            d="M134.252 431.966C137.172 413.603 163.603 413.603 166.523 431.966L184.232 543.349C185.138 549.043 188.978 553.839 194.336 555.967L258.481 581.446C272.723 587.103 272.042 607.49 257.453 612.183L195.311 632.175C189.417 634.071 185.101 639.136 184.165 645.257L166.538 760.458C163.709 778.947 137.067 778.947 134.238 760.458L116.611 645.257C115.675 639.136 111.359 634.071 105.465 632.175L43.3222 612.183C28.7339 607.49 28.0523 587.103 42.2947 581.446L106.439 555.967C111.798 553.839 115.638 549.043 116.543 543.349L134.252 431.966Z"
            fill="url(#paint1_linear_394_326)"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_n_394_326"
          x="224.538"
          y="117.689"
          width="317.731"
          height="477.846"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.5 0.5"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="8004"
          />
          <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
          <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
          <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
          <feMerge result="effect1_noise_394_326">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>
        <filter
          id="filter1_n_394_326"
          x="31.9873"
          y="418.194"
          width="236.801"
          height="356.132"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.5 0.5"
            stitchTiles="stitch"
            numOctaves="3"
            result="noise"
            seed="4279"
          />
          <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "
            />
          </feComponentTransfer>
          <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
          <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
          <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
          <feMerge result="effect1_noise_394_326">
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>
        <linearGradient
          id="paint0_linear_394_326"
          x1="383.404"
          y1="0"
          x2="383.404"
          y2="718.553"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.423072" stopColor="#279EFF" stopOpacity="0" />
          <stop offset="1" stopColor="#185F99" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_394_326"
          x1="150.388"
          y1="330.482"
          x2="150.388"
          y2="866.009"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.389416" stopColor="#3DA8FF" stopOpacity="0" />
          <stop offset="1" stopColor="#256599" />
        </linearGradient>
      </defs>
    </svg>
  );
}
