"use client"
import { type CSSProperties, useEffect, useState } from "react"
import PlurkPost, { type PostData } from "../plurk-post/plurk-post"
import PlurkResponseBox from "../plurk-post/plurk-response-box"

const hashtag = (label: string, href: string) => (
  <span className="hashtag">
    <a className="hashtag" target="_blank" href={href} rel="noopener noreferrer">
      {label}
    </a>
  </span>
)

const pictureLink = (href: string, src: string) => (
  <a href={href} className="ex_link pictureservices" rel="nofollow">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt="" height={48} />
  </a>
)

const metaLink = (href: string, imageSrc: string, label: string) => (
  <a href={href} className="ex_link meta" rel="nofollow" target="_blank">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={imageSrc} height={48} alt="" />
    {label}
  </a>
)

const whisperPost: PostData = {
  pid: "356967425732085",
  avatarUrl: "https://avatars.plurk.com/99999-small4626258.gif",
  displayName: "ಠ_ಠ",
  nameColor: "#AE00B0",
  qualifier: { text: "偷偷說", className: "q_whispers" },
  content: (
    <>
      {hashtag("#賣噗幣", "/search?q=賣噗幣")}{" "}
      {hashtag("#售噗幣", "/search?q=售噗幣")}{" "}
      {hashtag("#噗幣交易河", "/search?q=噗幣交易河")}
      <br />
      5{" "}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="emoticon_my"
        src="https://emos.plurk.com/631f7b28258755dc72ad5380be2eb362_w20_h20.gif"
        width={20}
        height={20}
        alt=""
      />
      {" "}240
      <br />
      剩1組
    </>
  ),
  showEdit: false,
  muteState: "off",
  likeState: "off",
  replurkState: "off",
  showReplurk: true,
  replurkCount: 0,
  responseCount: 5,
  showResponseCount: true,
  timeText: "1 小時",
}

const mutedPost: PostData = {
  pid: "354208900685065",
  avatarUrl: "https://s.plurk.com/c8980959827c3c923bdd.jpg",
  displayName: "ptestcss",
  content: (
    <>
      消音測試！{" "}
      {pictureLink(
        "https://images.plurk.com/32XPiaHJCf5pP7gZCgO3hR.png",
        "https://images.plurk.com/mx_32XPiaHJCf5pP7gZCgO3hR.jpg"
      )}
    </>
  ),
  showEdit: true,
  muteState: "on",
  likeState: "off",
  replurkState: "off",
  responseCount: 0,
  showResponseCount: false,
  timeText: "3 小時",
}

const r18Post: PostData = {
  pid: "356966834913331",
  avatarUrl: "https://s.plurk.com/c8980959827c3c923bdd.jpg",
  displayName: "ptestcss",
  showPornIcon: true,
  content: (
    <>
      R18噗測試
      <br />
      {pictureLink(
        "https://images.plurk.com/6ZJ1yANzRcR6BN7BKeGXLD.jpg",
        "https://images.plurk.com/mx_6ZJ1yANzRcR6BN7BKeGXLD.jpg"
      )}
    </>
  ),
  showEdit: true,
  muteState: "off",
  likeState: "off",
  replurkState: "off",
  responseCount: 0,
  showResponseCount: false,
  timeText: "3 小時",
}

const normalPost: PostData = {
  pid: "354208900030706",
  avatarUrl: "https://s.plurk.com/c8980959827c3c923bdd.jpg",
  displayName: "ptestcss",
  content: (
    <>
      正常噗+回覆測試
      {metaLink(
        "https://en.wikipedia.org/wiki/Cat",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1280px-Cat_August_2010-4.jpg",
        "Cat - Wikipedia"
      )}
      {pictureLink(
        "https://images.plurk.com/75eO0whFoYXzgAxYgQ6hio.jpg",
        "https://images.plurk.com/75eO0whFoYXzgAxYgQ6hio.jpg"
      )}
    </>
  ),
  reactions: [
    { src: "https://s.plurk.com/emoticons/basic2/38692e95e30abcd59898.gif", count: 1 },
    { src: "https://s.plurk.com/emoticons/basic2/28a8c933cf014dcd423a.gif", count: 1 },
    { src: "https://s.plurk.com/emoticons/basic2/3d5dd88acb198686283f.gif", count: 1 },
  ],
  showEdit: true,
  muteState: "off",
  likeState: "off",
  likeCount: 2,
  replurkState: "off",
  showMark: true,
  responseCount: 2,
  showResponseCount: true,
  timeText: "1 小時",
  thread: {
    reactionCount: 3,
    responseLabel: "2 則回應",
    responses: [
      {
        id: "response-friend",
        displayName: "( •͈́ ཅ •͈̀  )",
        nameColor: "#E8AF37",
        content: "噗友回應！",
      },
      {
        id: "response-owner",
        displayName: "ptestcss",
        content: "本人回應",
        isOwner: true,
      },
    ],
  },
}

interface PostSlot {
  id: string
  data: PostData
  className?: string
  position: CSSProperties
}

const postSlots: PostSlot[] = [
  {
    id: "whisper",
    data: whisperPost,
    position: { left: "300px", top: "10%" },
  },
  {
    id: "normal",
    data: normalPost,
    position: { left: "750px", top: "5%" },
  },
  {
    id: "r18",
    data: r18Post,
    className: "porn",
    position: { left: "450px", top: "56%" },
  },
  {
    id: "muted",
    data: mutedPost,
    position: { left: "890px", top: "60%" },
  },
]

const PlurkTimelinePosts = () => {
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null)
  const [activePostId, setActivePostId] = useState<string | null>(null)

  // Handle click outside to remove plurk_box class
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.plurk')) { //點在噗區塊外面
        setActivePostId(null) //關閉目前選中的噗：取消 plurk_box、隱藏回覆框等依 activePostId 的 UI。
      }
    }

    if (activePostId) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [activePostId])

  const handlePostClick = (postId: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setActivePostId(prev => prev === postId ? null : postId)
  }

  const handlePostMouseEnter = (postId: string) => () => {
    setHoveredPostId(postId)
  }

  const handlePostMouseLeave = (postId: string) => () => {
    if (activePostId !== postId) {
      setHoveredPostId(current => current === postId ? null : current)
    }
  }

  const getClassName = (slot: PostSlot) => {
    const parts = ["plurk", "cboxAnchor"]
    if (slot.className) parts.push(slot.className)
    if (hoveredPostId === slot.id || activePostId === slot.id) {
      parts.push("display", "link_extend")
    }
    if (activePostId === slot.id) parts.push("plurk_box")
    return parts.join(" ")
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

      {postSlots.map((slot, index) => (
        <div
          key={slot.id}
          className={getClassName(slot)}
          id={`p${slot.data.pid}`}
          style={slot.position}
          onMouseEnter={handlePostMouseEnter(slot.id)}
          onMouseLeave={handlePostMouseLeave(slot.id)}
          onClick={handlePostClick(slot.id)}
        >
          <PlurkPost data={slot.data} skipStyles={index > 0} />
          {activePostId === slot.id && slot.data.thread && (
            <PlurkResponseBox thread={slot.data.thread} />
          )}
        </div>
      ))}
    </>
  )
}

export default PlurkTimelinePosts
