import React from 'react'

const Footer = () => {
    return (
        <footer className='site-footer' role='contentinfo' id='site-footer'>
            <div className='site-footer__inner'>
                <div className='site-footer__info'>
                    <p className='site-footer__credit'>
                        Created by <span className='site-footer__name'>Vasu Goel</span>
                    </p>
                    <a
                        href='mailto:vasugoel2016@gmail.com'
                        className='site-footer__email'
                        aria-label='Send email to Vasu Goel'
                    >
                        vasugoel2016@gmail.com
                    </a>
                </div>

                <div className='site-footer__divider' aria-hidden='true' />

                <a
                    href='https://digitalheroesco.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='site-footer__cta'
                    id='digital-heroes-link'
                    aria-label='Visit Digital Heroes website (opens in a new tab)'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        aria-hidden='true'
                    >
                        <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                        <polyline points='15 3 21 3 21 9' />
                        <line x1='10' y1='14' x2='21' y2='3' />
                    </svg>
                    Built for Digital Heroes
                </a>
            </div>
        </footer>
    )
}

export default Footer
