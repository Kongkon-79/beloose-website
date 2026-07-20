import React from 'react'
import StoreUserHero from './_components/store-user-hero'
import TrustedBy from '../../_components/trusted-by'
import HowHumidorWorks from './_components/how-humidor-works'
import Testimonial from './_components/testimonial'
import AgeVerification from './_components/age-verification'

const UserStorePage = ({params}:{params:{id:string}}) => {

    console.log(params)
  return (
    <AgeVerification>

        <StoreUserHero/>
        <TrustedBy/>
        <Testimonial/>
        <HowHumidorWorks/>
    </AgeVerification>
  )
}

export default UserStorePage
