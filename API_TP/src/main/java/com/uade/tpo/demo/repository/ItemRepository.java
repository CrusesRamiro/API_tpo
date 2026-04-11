package com.uade.tpo.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.demo.entity.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
