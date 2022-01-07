import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { CreateElementOptions, Element } from 'parallax-controller';
import { useController } from '../../hooks/useController';
import { removeUndefinedObjectKeys } from '../../utils/removeUndefinedObjectKeys';
import { ParallaxProps } from './types';
import { useVerifyController } from './hooks';

export function Parallax(props: PropsWithChildren<ParallaxProps>) {
  const controller = useController();
  const refInner = useRef<HTMLElement>();

  useVerifyController(controller);

  function _getElementOptions(): CreateElementOptions {
    const useSpeedProp = typeof props.speed !== 'undefined';
    const isHorizontal = controller?.scrollAxis == 'horizontal';
    const isVertical = controller?.scrollAxis == 'vertical';

    let translateX = props.translateX;
    let translateY = props.translateY;

    if (useSpeedProp && isHorizontal) {
      translateX = [
        `${(props.speed || 0) * 10}px`,
        `${(props.speed || 0) * -10}px`,
      ];
    }

    if (useSpeedProp && isVertical) {
      translateY = [
        `${(props.speed || 0) * 10}px`,
        `${(props.speed || 0) * -10}px`,
      ];
    }

    return {
      // @ts-expect-error
      el: refInner.current,
      props: removeUndefinedObjectKeys({
        translateX,
        translateY,
        disabled: props.disabled,
        rotate: props.rotate,
        rotateX: props.rotateX,
        rotateY: props.rotateY,
        rotateZ: props.rotateZ,
        scale: props.scale,
        scaleX: props.scaleX,
        scaleY: props.scaleY,
        scaleZ: props.scaleZ,
        opacity: props.opacity,
        easing: props.easing,
        rootMargin: props.rootMargin,
        shouldStartAnimationInitialInView:
          props.shouldStartAnimationInitialInView,
        onProgressChange: props.onProgressChange,
        onChange: props.onChange,
        onEnter: props.onEnter,
        onExit: props.onExit,
        startScroll: props.startScroll,
        endScroll: props.endScroll,
        targetElement: props.targetElement,
      }),
    };
  }

  const [element, setElement] = useState<Element>();

  // create element
  useEffect(() => {
    const newElement = controller?.createElement(_getElementOptions());
    setElement(newElement);

    return () => {
      if (newElement) {
        controller?.removeElementById(newElement.id);
      }
    };
  }, []);

  // update element
  useEffect(() => {
    if (element) {
      if (props.disabled) {
        controller?.resetElementStyles(element);
      } else {
        controller?.updateElementPropsById(
          element.id,
          _getElementOptions().props
        );
      }
    }
  }, [
    props.disabled,
    props.translateX,
    props.translateY,
    props.rotate,
    props.rotateX,
    props.rotateY,
    props.rotateZ,
    props.scale,
    props.scaleX,
    props.scaleY,
    props.scaleZ,
    props.speed,
    props.opacity,
    props.easing,
    props.rootMargin,
    props.onProgressChange,
    props.onChange,
    props.onEnter,
    props.onExit,
    props.targetElement,
  ]);

  const Outer = props.tag;
  const Inner = props.innerTag;

  return (
    <Outer className={props.className} style={props.style}>
      <Inner
        className={props.innerClassName}
        ref={refInner}
        style={props.innerStyle}
      >
        {props.children}
      </Inner>
    </Outer>
  );
}

Parallax.defaultProps = {
  disabled: false,
  innerTag: 'div',
  tag: 'div',
};
