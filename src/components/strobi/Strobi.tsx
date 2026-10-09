"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from "react"
import {
  loadAvatarRuntime,
  type AvatarPlayOptions,
  type AvatarState,
  type RuntimeAvatar,
} from "./avatar-runtime"
import { avatarData, type AnimationName } from "./strobi.avatar"

export type { AnimationName } from "./strobi.avatar"
export type AvatarHandle = {
  play: (animation?: AnimationName, options?: AvatarPlayOptions) => void
  pause: () => void
  stop: () => void
  setExpression: (expression: string) => void
  getState: () => AvatarState<AnimationName> | null
}
export type AvatarProps = {
  animation?: AnimationName
  playing?: boolean
  loop?: boolean
  size?: number | string
  className?: string
  style?: CSSProperties
  onAnimationEnd?: (animation: AnimationName) => void
}

export const Strobi = forwardRef<AvatarHandle, AvatarProps>(function Strobi(
  {
    animation = "idle",
    playing = true,
    loop,
    size = 240,
    className,
    style,
    onAnimationEnd,
  },
  ref
) {
  const host = useRef<HTMLSpanElement>(null)
  const controller = useRef<RuntimeAvatar<AnimationName> | null>(null)
  const animationRef = useRef(animation)
  const playingRef = useRef(playing)
  const onAnimationEndRef = useRef(onAnimationEnd)
  animationRef.current = animation
  playingRef.current = playing
  onAnimationEndRef.current = onAnimationEnd

  useEffect(() => {
    if (!host.current) return
    let disposed = false
    let avatar: RuntimeAvatar<AnimationName> | null = null
    void loadAvatarRuntime<AnimationName>(avatarData).then((runtime) => {
      if (disposed || !host.current) return
      avatar = runtime.createAvatar(host.current, {
        animation: animationRef.current,
        autoplay: playingRef.current,
        loop,
        size: "100%",
        onAnimationEnd: (next) => onAnimationEndRef.current?.(next),
      })
      controller.current = avatar
    })
    return () => {
      disposed = true
      avatar?.destroy()
      controller.current = null
    }
  }, [loop])

  useEffect(() => {
    const avatar = controller.current
    if (!avatar) return
    if (playing) avatar.play(animation)
    else avatar.pause()
  }, [animation, playing])

  useImperativeHandle(
    ref,
    () => ({
      play(next = animation, options) {
        controller.current?.play(next, options)
      },
      pause() {
        controller.current?.pause()
      },
      stop() {
        controller.current?.stop()
      },
      setExpression(expression) {
        controller.current?.setExpression(expression)
      },
      getState() {
        return controller.current?.getState() ?? null
      },
    }),
    [animation]
  )

  const dimension = typeof size === "number" ? size + "px" : size
  return (
    <span
      ref={host}
      className={className}
      style={{ display: "inline-block", width: dimension, height: dimension, ...style }}
    />
  )
})

export default Strobi
