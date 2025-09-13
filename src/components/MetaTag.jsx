import { Helmet } from 'react-helmet-async';

const MetaTag = () => {
    const location = window.location.origin;
    let text = '';
    if (location === 'https://www.picklebay.com' || location === 'https://picklebay.com') {
        text = 'index, follow';
    } else if (location === 'https://uat.picklebay.com/') {
        text = 'noindex, nofollow';
    } else {
        text = 'noindex, nofollow';
    }

    return (
        <Helmet>
            <meta name="robots" content={text} />
        </Helmet>
    );
};

export default MetaTag;
