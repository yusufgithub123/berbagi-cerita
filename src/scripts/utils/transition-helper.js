const initViewTransition = (callback) => {
  if (!document.startViewTransition) {
    callback();
    return;
  }

  document.startViewTransition(() => {
    callback();
  });
};

const setupCustomTransition = () => {
  document.documentElement.classList.add('view-transition-enabled');

  document.addEventListener('viewtransitionstart', () => {
    console.log('View transition started');
  });

  document.addEventListener('viewtransitionend', () => {
    console.log('View transition ended');
  });
};

const setupAnimationAPI = () => {
  document.documentElement.animate(
    [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    {
      duration: 500,
      easing: 'ease-out',
      fill: 'forwards'
    }
  );
};

export { initViewTransition, setupCustomTransition, setupAnimationAPI };
