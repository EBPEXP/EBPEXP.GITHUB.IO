import { forceFetchData, categories, benefits } from '/firebase/firebaseData.js';
const params = new URLSearchParams(window.location.search);
let id = params.get('id');

//setting link for delete benefit button
document.getElementById('deleteBenefit').setAttribute("href",`/admin/delete_benefit/delete_benefit_form.html?id=${id}`);
//setting link for add benefit button
document.getElementById('addBenefit').setAttribute("href",`/admin/add_benefit/admin_add_benefit.html?id=${id}`);

document.addEventListener('DOMContentLoaded', async () => {
    const loadingAnimation = document.getElementById('loading-animation');

    // Show loading animation initially
    loadingAnimation.style.display = 'flex';
    await forceFetchData();
    const categoryData = categories.find(item => item.id === id);
    const categoryOtherData = categories.filter(item => item.id !== id);

//displaying names of catagory in the heading
    $(".headingBox h1").text(categoryData.name)
    $(".sideHeadingBox:eq(0)").html(categoryOtherData[0].name)
    $(".sideHeadingBox:eq(0)").attr("href", `?id=${categoryOtherData[0].id}`)
    $(".sideHeadingBox:eq(1)").html(categoryOtherData[1].name)
    $(".sideHeadingBox:eq(1)").attr("href", `?id=${categoryOtherData[1].id}`)
    // Hide loading animation after everything is loaded
    loadingAnimation.style.display = 'none';
    createBenefitBox();
})

//function to create the benefit boxes
function createBenefitBox() {
    const linkContainer = document.getElementsByClassName('popular-benefits');
    let htmlDataBenefit = ''
    let myBenefits = benefits.sort((a, b) => b.views - a.views);
    myBenefits.forEach(item =>{
        if(item.categoryId === id){
            htmlDataBenefit += `<a href="/admin/edit_benefit/admin_edit_benefit.html?id=${item.id}">
                                    <div class="benefit-card card">
                                        <i class="fas ${item.icon} fa-2x"></i>
                                        <h5>${item.name}</h5>
                                    </div>
                                </a>`
        }
    })
    linkContainer[0].innerHTML = htmlDataBenefit;
}