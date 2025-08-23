"use client"
import { useEffect, useState } from "react"
import PlurkPost from "../plurk-post/plurk-post"

const PlurkTimelinePosts = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  // Handle click outside to remove plurk_box class
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.plurk')) {
        setIsClicked(false)
      }
    }

    if (isClicked) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isClicked])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsClicked(!isClicked)
  }

  // Build className dynamically
  const getClassName = () => {
    let className = "plurk cboxAnchor"
    if (isHovered) className += " display link_extend "
    if (isClicked) className += " display link_extend plurk_box "
    return className
  }

  return (
    <>
      <style>
        {`
        .timeline-cnt .plurk {
          position: absolute;
          z-index: 5;
          cursor: pointer;
        }
        .plurk {
          color: #111;
          white-space: nowrap;
        }
        .timeline-cnt .display {
          width: 380px;
          z-index: 1200;
        }
          .timeline-cnt .plurk_box {
    width: 503px;
    z-index: 10;
}
        `}
      </style>

      {/* Single Post */}
      <div
        className={getClassName()}
        data-pid=""
        data-uid=""
        data-type="plurk"
        data-respcount="0"
        id=""
        data-block-idx="0_2"
        style={{ left: "158.762px", top: "5.5%" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <PlurkPost />
      </div>
    </>
  )
}

export default PlurkTimelinePosts