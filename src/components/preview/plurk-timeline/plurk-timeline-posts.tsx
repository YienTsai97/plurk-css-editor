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

const metaLink = (href: string, imageSrc: string, label: string) => (
  <a href={href} className="ex_link meta" rel="nofollow" target="_blank">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={imageSrc} height={48} alt="" />
    {label}
  </a>
)

const whisperPost: PostData = {
  pid: "356967425732085",
  avatarUrl: "/anonymous.png",
  displayName: "ಠ_ಠ",
  nameColor: "#AE00B0",
  qualifier: { text: "偷偷說", className: "q_whispers" },
  content: (
    <>
      {hashtag("#賣噗幣", "/search?q=賣噗幣")}{" "}
      {hashtag("#售噗幣", "/search?q=售噗幣")}{" "}
      {hashtag("#噗幣交易河", "/search?q=噗幣交易河")}
      <br />
      <span style={{ whiteSpace: "nowrap" }}>
        5 <img className="emoticon_my" src="/coin.png" width={20} height={20} alt="" /> = 240
      </span>
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
  avatarUrl: "/profile_icon.png",
  displayName: "我的帳號",
  content: (
    <>
      這是一則消音噗！<br />
      右鍵設置透明度~
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
  avatarUrl: "/profile_icon.png",
  displayName: "我的帳號",
  showPornIcon: true,
  content: (
    <>
      成人話題！噓~~<br />
      右鍵設置馬賽克！
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
  avatarUrl: "/profile_icon.png",
  displayName: "我的帳號",
  content: (
    <>
      正常噗文 + 回覆
      {metaLink(
        "https://zh.wikipedia.org/zh-tw/%E5%99%97%E6%B5%AA",
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Plurk_logo_2018.svg/250px-Plurk_logo_2018.svg.png?utm_source=zh.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
        "噗浪 - Wikipedia"
      )}
    </>
  ),
  reactions: [
    { src: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Bpa3pnNWlodmNobWQyb3hnNG83dmlpbmdta3dkMjVnaTUzdWYxOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rq2jXlnzIwxseqeG8J/giphy.gif", count: 1 }
  ],
  showEdit: true,
  muteState: "off",
  likeState: "on",
  likeCount: 1,
  replurkState: "off",
  showMark: true,
  markState: "on",
  responseCount: 2,
  showResponseCount: true,
  timePrefix: "上次編輯",
  timeText: new Date().toLocaleDateString(),
  thread: {
    reactionCount: 3,
    favoriteCount: 1,
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
        displayName: "我的帳號",
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
    // 用途：示範未讀回應數徽章，讓 `.timeline-cnt .new .response_count` 可直接預覽。
    className: "new",
    position: { left: "300px", top: "10%" },
  },
  {
    id: "normal",
    data: normalPost,
    // 用途：示範未讀回應數徽章，並保留正常噗與回覆串互動測試。
    // className: "new",為未讀回應數徽章，現在為未讀回應數徽章，所以不需要。
    className: "",
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
          cursor: pointer;
        }
        .plurk {
          color: #111;
          white-space: nowrap;
          /* 用途：噗文 z-index 放在 .plurk，不要綁 .timeline-cnt，以免整層蓋住吉祥物。 */
          z-index: 5;
        }
        .timeline-cnt .display {
          width: 380px;
          z-index: 1200;
        }
        .timeline-cnt .plurk_box {
          width: 503px;
        }
        :where(.timeline-cnt .plurk_box) {
          /* 用途：:where 降低展開噗預設 z-index 權重，讓使用者 CSS 可覆寫。 */
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
          <PlurkPost
            data={slot.data}
            skipStyles={index > 0}
            slotClassName={slot.className}
          />
          {activePostId === slot.id && slot.data.thread && (
            <PlurkResponseBox thread={slot.data.thread} />
          )}
        </div>
      ))}
    </>
  )
}

export default PlurkTimelinePosts
