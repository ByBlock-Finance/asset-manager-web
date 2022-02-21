<template>
    <div class="footer">
        <div class="column logo-and-contacts">
            <img class="footer-logo" src="../../assets/logo_small_white.png" alt="Logo Small White">
            <div class="title">{{ $t('footer.generalInfo.title') }}</div>
            <div class="text">{{ $t('footer.generalInfo.address') }}<br>{{ $t('footer.generalInfo.zip') }}</div>
            <div class="text">{{ $t('footer.generalInfo.phone') }}</div>
            <div class="text">{{ 'info@' + $t('footer.generalInfo.email') }}</div>
        </div>
        <div class="column products">
            <div class="title">{{ $t('footer.products') }}</div>
            <div class="text">
                <a href="https://www.etsnord.com/productgroups/norddiffuser" target="_blank">NORDdiffuser</a>
                </div>
            <div class="text">
                <a href="https://www.etsnord.com/productgroups/nordgrille" target="_blank">NORDgrille</a>
                </div>
            <div class="text">
                <a href="https://www.etsnord.com/productgroups/nordfire" target="_blank">NORDfire</a>
                </div>
            <div class="text">
                <a href="https://www.etsnord.com/productgroups/nordsilencer" target="_blank">NORDsilencer</a>
                </div>
            <div class="text">
                <a href="https://www.etsnord.com/productgroups/norddamper" target="_blank">NORDdamper</a>
                </div>
            <div class="text">
                <a href="https://www.etsnord.com/productgroups/nordexternal" target="_blank">NORDexternal</a>
                </div>
            <div class="text">
                <a href="https://www.etsnord.com/productgroups/nordroof" target="_blank">NORDroof</a>
                </div>
            <div class="text">
                <a href="https://www.etsnord.com/productgroups/nordcanopy" target="_blank">NORDcanopy</a>
                </div>
        </div>
        <div class="column company">
            <div class="title">{{ $t('footer.company') }}</div>
            <div class="text">
                <a href="https://www.etsnord.com/contact-info" target="_blank">{{ $t('footer.contactUs') }}</a>
            </div>
            <div class="text">
                <a href="https://www.etsnord.com/about-the-company" target="_blank">{{ $t('footer.aboutUs') }}</a>
            </div>
            <div class="text">
                <a href="https://www.etsnord.com/job-vacancies" target="_blank">{{ $t('footer.carrers') }}</a>
            </div>
        </div>
        <div class="column guide-and-help">
            <div class="title">{{ $t('footer.guideAndHelp') }}</div>
            <div class="text">
                <a href="https://www.etsnord.fi/content/uploads/2021/01/ETS_NORD_Privacy_Statement_en.pdf" target="_blank">{{ $t('footer.privacy') }}</a>
            </div>
        </div>
        <!-- <div class="column get-in-touch">
            <div class="title">{{ $t('footer.getInTouch') }}</div>
            <div class="icons-container">
                <a href="https://www.linkedin.com/company/ets-nord-as/?originalSubdomain=ee" target="_blank">
                    <img src="../../assets/icons/singular/linkedin.svg" width="32" height="32" alt="LinkedIn logo" class="mr-4">
                </a>
                <a href="https://www.youtube.com/channel/UCv5F-gjALzxbkOxPGAyEaSQ/featured" target="_blank">
                    <img src="../../assets/icons/singular/youtube.svg" width="32" height="32" alt="YouTube logo">
                </a>
            </div>
        </div> -->
    </div>
</template>

<script>

import contactData from "@/constants/etsContactData";

export default {
    name: 'Footer',
    data() {
        return {
            contactData: contactData
        }
    }
}
</script>

<style scoped>
.footer {
    display: flex;
    width: 100%;
    height: 300px;
    left: 0;
    background: #4C5055;
    padding: 48px 120px;
    box-sizing: border-box;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
}

.footer .footer-logo {
    width: 175px;
    height: 24px;
    margin-bottom: 40px;
}

.footer .title {
    color: #FFFFFF;
    margin-bottom: 16px;
}

.footer .text {
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: #FFFFFF;
    margin-bottom: 8px;
}

.footer .column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}

.footer .logo-and-contacts .text {
    margin-bottom: 14px;
}

.footer .get-in-touch .text {
margin-bottom: 16px;
}

.footer .get-in-touch .text img {
margin-right: 16px;
}

.icons-container {
     display: flex;
     flex-wrap: nowrap;
     align-items: center;
}

.icons-container img {
    display: flex;
}
</style>
