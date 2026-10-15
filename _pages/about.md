---
permalink: /
title: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

## 🍀About me 
<!-- completed my undergraduate studies at the [**University of Emergency Management**](https://uem.ncist.edu.cn/), and I am  -->
Come from **Taiyuan, Shanxi, China**, currently pursuing a master's degree in computer science at [**ShenYang Jianzhu University**](https://www.sjzu.edu.cn/), supervised by [**Prof.Yuanshuai**](https://syjz.teacher.360eol.com/teacherBasic/preview?teacherId=23776). For now, my primary research focuses on fine-tuning diffusion models for deep estimation tasks. 

I used to participate in many **ACM algorithm** competitions(***2022-2023***), but have now retired. In my daily life, I enjoy reading and photography. You can view my photography collection in the [**Gallery**](https://haruko386.github.io/gallery/). I'm also a Golang backend developer. Feel free to communicate with me about <u><i>CV</i></u> and <u><i>Golang</i></u>
<img src="../images/logo/golang.png" style="width: 15px; margin-top: center">

-------------------------
<table width="100%" align="center" border="0" cellspacing="0" cellpadding="20" style="border: 0;">
      <tbody><tr>
        <td width="20%" valign="middle" style="text-align: center;"> 
          <a href="#"><img src="../images/logo/evoc.png" width="250"></a>
        </td>
        <td width="20%" valign="middle" style="text-align: center;">
          <a href="#"><img src="../images/logo/InfiniFlow.png" width="250"></a>
        </td>
        <td width="20%" valign="middle" style="text-align: center;"> 
          <a href="#"><img src="../images/logo/logo-801-v2.png" width="250"></a>
        </td>
        <td width="20%" valign="middle" style="text-align: center;"> 
          <a href="#"><img src="../images/logo/SJZU.jpg" width="250"></a>
        </td>
        <td width="20%" valign="middle" style="text-align: center;">
          <a href="#"><img src="../images/logo/UEM.png" width="250"></a>
        </td>
      </tr></tbody>
</table>

## 📝 Publications 

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ACM</div><img src='../ApDepth-v2/asset/training_framework.png' alt="ApDepth V2 paper preview" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[**ApDepth V2: Geometry-Aware Refinement for Single-Step Monocular Depth Estimation**]()

\[[Paper(Pre-release)]()\] \[[~~Model~~]()\] 
<p class="paper-summary">
We introduce <span style="font-family: Georgia, 'Times New Roman', serif; font-weight: 800; font-style: italic; color: #355C7D; font-variant: small-caps;">ApDepth V2</span>, an enhanced single-step monocular depth estimation framework built upon Stable Diffusion 2.1. It introduces a continuous fine-tuning strategy with delayed decoder adaptation and Spatially Debiased Window Transport (SDWT), enabling misalignment-tolerant local geometry supervision while preserving depth reconstruction consistency.
</p>
</div>
</div>


<div class='paper-box'><div class='paper-box-image'><div class="apdepth-preview" data-apdepth-preview>
  <div class="badge">arXiv</div>
  <a class="apdepth-preview__comparison" href="{{ '/ApDepth-G/' | relative_url }}" aria-label="View ApDepth-G: fixed RGB and Ours predictions compared with Marigold v2, Lotus-2, PPD, Lotus, Marigold, and DepthMaster in a horizontal slideshow.">
    <span class="apdepth-preview__columns" aria-hidden="true">
      <span class="apdepth-preview__panel" style="--panel: 0;"></span>
      <span class="apdepth-preview__panel" style="--panel: 1;"></span>
      <span class="apdepth-preview__window">
        <span class="apdepth-preview__track">
          <span class="apdepth-preview__panel" style="--panel: 2;"></span>
          <span class="apdepth-preview__panel" style="--panel: 3;"></span>
          <span class="apdepth-preview__panel" style="--panel: 4;"></span>
          <span class="apdepth-preview__panel" style="--panel: 5;"></span>
          <span class="apdepth-preview__panel" style="--panel: 6;"></span>
          <span class="apdepth-preview__panel" style="--panel: 7;"></span>
          <span class="apdepth-preview__panel" style="--panel: 2;"></span>
        </span>
      </span>
    </span>
  </a>
  <button class="apdepth-preview__toggle" type="button" aria-label="Pause comparison slideshow" aria-pressed="false" hidden><span aria-hidden="true">Ⅱ</span></button>
</div></div>
<script src="{{ '/assets/js/apdepth-preview.js' | relative_url }}" defer></script>
<div class='paper-box-text' markdown="1">

[**Mind the Sky: Resolving Sky-Depth Collapse with Validity-Guided Diffusion**](https://haruko386.github.io/ApDepth-G)

\[[~~Paper~~](#)\] \[[Model](https://huggingface.co/developy/ApDepth-G)\] 
<p class="paper-summary">
We presents <span style="font-family: Georgia, 'Times New Roman', serif; font-weight: 800; font-style: italic; color: #1a1236; font-variant: small-caps;">ApDepth-G</span>,  a multi-step geometric diffusion refinement framework for sky-stable monocular depth estimation. It progressively refines latent depth representations through multi-step denoising and improves training with offset noise regularization, SNR-based loss reweighting, and latent gradient consistency.
</p>
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">IMAVIS 2026</div><img src='../files/cover/cover1.png' alt="ApDepth paper preview" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

[**ApDepth: Aiming for Precise Monocular Depth Estimation Based on Diffusion Models**](https://haruko386.github.io/research/)

\[[Paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7604741)\] \[[Demo](https://huggingface.co/spaces/developy/ApDepth)\] \[[Model](https://huggingface.co/developy/ApDepth)\] 
<p class="paper-summary">
This paper presents <span style="font-family: Georgia, 'Times New Roman', serif; font-weight: 800; font-style: italic; color: #2c3e50; font-variant: small-caps;">ApDepth</span>, a novel single-step diffusion framework for monocular depth estimation that achieves fast inference while preserving fine-grained edge details through a tailored two-stage training strategy combined with novel frequency-domain and cosine similarity losses.
</p>
</div>
</div>

## 🤗Dataset

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">huggingface</div><video autoplay muted loop playsinline preload="metadata" width="100%" aria-label="Overwatch depth dataset preview"><source src="../images/dataset.mp4" type="video/mp4"></video></div></div>
<div class='paper-box-text' markdown="1">

[**Overwatch Depth Dataset**](https://haruko386.github.io/overwatch_dataset)

\[[Dataset](https://huggingface.co/datasets/developy/overwatch)\] 
<p class="paper-summary">
The <span style="font-family: Georgia, 'Times New Roman', serif; font-weight: 800; font-style: italic; color: #2c3e50; font-variant: small-caps;">Overwatch Depth Dataset</span> contains pixel-aligned RGB images and dense depth maps captured from diverse synthetic outdoor environments. Streets, buildings, vegetation, open spaces, and long-range sky regions provide varied geometry for training and evaluating monocular depth estimation models.
</p>
</div>
</div>

## 🎈ACM ＆ OI

**ACM** Algorithm Competition participant, primarily competing in online contests on platforms such as **Leetcode**, **Atcoder**, and **Codeforces**. Historical ratings on each platform are available [here](https://clist.by/coder/Developly/). 

<div style="text-align: center;">
   <img src="https://s2.loli.net/2024/11/03/AkSdGvHfixl8t4w.png" alt="ちー的各算法竞赛平台rating" style="zoom:50%; box-shadow: 6px 6px 8px #888; border: 0px solid #efefef; border-radius: 12px;" />
</div>

## 🏆Speedrun

I have participated in many speedrun competitions, mainly working on the **Hollow Knight** IL project, and have achieved top 30 worldwide rankings in each of them, even winning a **WR** in one of them and a **fourth** place in another.

<div style="text-align: center;">
   <img src="https://s2.loli.net/2024/10/01/N3EcjMDoe65SWmH.png" alt="Game Speedrun" style="zoom:50%; box-shadow: 6px 6px 8px #888; border: 0px solid #efefef; border-radius: 10px;" />
   <p style="color: gray; font-size: smaller; margin-top: 0cm;">
      WR on Hollow Knight Trial of the Warrior
   </p>
</div>
